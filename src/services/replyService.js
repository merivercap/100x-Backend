const db = require('../models/sequelize');
const models = db.sequelize.models;
const PostModel = models.post;
const UserModel = models.user;
const ReplyModel = models.reply;
const Op = db.Sequelize.Op;
const _ = require('lodash');
const client = require('./steem');
const idGenerator = require('./idGenerator');

const {
  GET_CONTENT_REPLIES,
  IS_DELETED,
  VOTE_WEIGHT,
} = require('../utils/constants');

module.exports = {
  broadcastAndStoreReply: function(authenticatedUserInstance, { postId, body, createdAt }) {
    return PostModel.findById(postId)
      .then(postRecord => {
        const postAuthor = postRecord.userId;
        const postPermLink = postRecord.permLink;
        const permLink = this.replyPermlink(postAuthor, postPermLink,
          authenticatedUserInstance.username, createdAt)
        return authenticatedUserInstance.broadcastReply({ postAuthor, postPermLink, permLink, body });
      })
      .then(broadcastSuccess => {
        if (broadcastSuccesss) {
          return authenticatedUserInstance.userInOurDb;
        }
      })
      .then(userRecord => {
        const permLink = this.replyPermlink(postAuthor, postPermLink,
          authenticatedUserInstance.username, createdAt)
        return this.fetchSingleSteemitReply(postId, permLink, userRecord);
      })
      .catch(err => {
        throw new Error(err);
      })
  },

  // $ curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_content_replies", "params":["trevonjb", "because-i-do-care"], "id":1}' https://api.steemit.com | jq
  replyPermlink: function(postAuthor, postPermLink, commenter, createdAt) {
     // e.g. "oadissin-re-trevonjb-because-i-do-care-20180911t021129058z"
     const iso = createdAt.toISOString().replace(/:|-./g, "").toLowerCase()
     const permLink = [commenter, 're', postAuthor, postPermLink, iso].join('-')
     return permLink
  },

  fetchAllPostReplies: function(postId) {
    return PostModel.findOne({ // find post
      where: {
        id: postId,
        isDeleted: false
      },
    }).then(postRecord => {
        // store post info...
        const postAuthor = postRecord.userId;
        const postPermLink = postRecord.permLink;
        return this.fetchRepliesFromSteemit(postId, postAuthor, postPermLink);
      })
      .then(result => {
        return ReplyModel.findAll({ where: { postId, isDeleted: false } })
      })
      .catch(err => {
        console.log(err, "post doesnt exist in the db, or error fetching replies.");
      })
  },

  fetchRepliesFromSteemit: function(postId, postAuthor, postPermLink, options) {
    const {
      params,
      parentId
    } = this.determineParamOptions(postAuthor, postPermLink, options);

    const addRepliesToDb = (replies) => {
       const storeAllReplies = replies[0].map(steemitReply => {
         const formattedReply = {...this.replyProperFormat(postId, steemitReply), parentId};
         return this.addReplyToDb(formattedReply)
       });
       return Promise.all(storeAllReplies);
     }

     return client.sendAsync(GET_CONTENT_REPLIES, params, addRepliesToDb);
  },

  addReplyToDb: function(replyObj) {
    return UserModel
      .findOrCreate({
        where: { name: replyObj.userId },
        defaults: { id: replyObj.userId + idGenerator.generate() }
      })
      .spread((commenter, created) => {
        return this.findOrCreateReply(replyObj, commenter);
      })
      .catch(err => console.log("trouble adding replies to db", err));
  },

  fetchSingleSteemitReply: async function(postId, permLink, userRecord) {
    const storeSteemitReplyInOurDb = (reply) => {
      const replyForOurDb = this.replyProperFormat(postId, reply[0]);
      return this.findOrCreateReply(replyForOurDb, userRecord);
    }
    const params = [[userRecord.id, permLink]];
    return client.sendAsync(GET_CONTENT, params, storeSteemitReplyInOurDb);
  },

  findOrCreateReply: function(replyObj, commenter) {
    return ReplyModel
      .findOrCreate({
        where: {id: replyObj.id},
        defaults: { ...replyObj, userId: commenter.id }
      })
      .spread((replyInOurDb, created) => {
        if (replyInOurDb.children > 0 && created) {
          return this.fetchRepliesFromSteemit(replyInOurDb.postId, null, null, { parentReply: replyInOurDb });
        }
      })
      .catch(err => console.log("trouble finding or creating reply", err));
  },

  replyProperFormat: function(postId, steemitReply) {
    const convertedValue = Number.parseFloat(steemitReply.pending_payout_value.split("SBD")[0]);
    return {
      id: steemitReply.id,
      postId: postId,
      userId: steemitReply.author,
      permLink: steemitReply.permlink,
      body: steemitReply.body,
      createdAt: steemitReply.created,
      netVotes: steemitReply.net_votes,
      pendingPayoutValue: convertedValue,
      depth: steemitReply.depth,
      children: steemitReply.children,
    }
  },

  determineParamOptions: function(postAuthor, postPermLink, options = {}) {
    let params;
    let parentId;
    if (options.parentReply) {
      params = [[ options.parentReply.userId, options.parentReply.permLink ]];
      parentId = options.parentReply.id;
    } else {
      params = [[ postAuthor, postPermLink ]];
      parentId = null;
    }

    return {
      params, parentId
    };
  },

  deleteReply: function({ permLink }) {
    return ReplyModel.findOne({
      where: { permLink },
    }).then(replyInOurDb => {
      const keyVal = {};
      keyVal[IS_DELETED] = true;
      return replyInOurDb.update(keyVal);
    }).catch(err => {
      throw new Error(err);
    });
  },

  voteReply: function({ authenticatedUserInstance, permLink, up }) {
    const weight = (up ? +1 : -1) * VOTE_WEIGHT;
    return ReplyModel.findOne({
        where: { permLink },
      }).then(replyInOurDb => {
        const replyAuthor = replyInOurDb.userId;
        return authenticatedUserInstance.vote({ permLink, replyAuthor, weight });
      }).then(broadcastSuccess => {
        if (broadcastSuccess) {
          return ReplyModel.findOne({
            where: { permLink },
          });
        }
      })
      .then(replyInOurDb => {
        const keyVal = {};
        keyVal[NETVOTES] = replyInOurDb.netVotes + weight;
        return replyInOurDb.update(keyVal);
      })
      .catch(err => {
        throw new Error(err);
      })
  }
}
