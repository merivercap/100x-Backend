const db         = require('../models/sequelize');
const models     = db.sequelize.models;
const PostModel  = models.post;
const UserModel  = models.user;
const ReplyModel = models.reply;
const Op         = db.Sequelize.Op;
const _          = require('lodash');
const client     = require('./steem');
const idGenerator = require('./idGenerator');

const {
  GET_CONTENT_REPLIES,
}                = require('../utils/constants');

module.exports = {
  broadcastAndStoreReply: function({ authenticatedUserInstance, postId, body }) {
    return PostModel.findById(postId)
      .then(postRecord => {
        const postAuthor = postRecord.userId;
        const postPermLink = postRecord.permLink;
        const permLink = this.replyPermlink(postAuthor, postPermLink, authenticatedUserInstance.username)
        return [authenticatedUserInstance.broadcastReply({ postAuthor, postPermLink, permLink, body }), permLink];
      })    
      .spread((broadcastSuccess, permLink) => {
        if (broadcastSuccess) {
          return [authenticatedUserInstance.userInOurDb, permLink];
        }
      })
      .spread((userRecord, permLink) => {
        return this.fetchSingleSteemitReply(postId, permLink, userRecord);
      })
      .catch(err => {
        new Error(err.error_description);
      })
  },

  // $ curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_content_replies", "params":["trevonjb", "because-i-do-care"], "id":1}' https://api.steemit.com | jq 
  replyPermlink: function(postAuthor, postPermLink, commenter) {
     // TODO: add created timestamp to reply permLink
     // "oadissin-re-trevonjb-because-i-do-care-20180911t021129058z"
     return [commenter, 're', postAuthor, postPermLink].join('-')
  },

  fetchAllPostReplies: function(postId) {
    return PostModel.findById(postId) //find post
      .then(postRecord => {
        // store post info...
        const postAuthor = postRecord.userId;
        const postPermLink = postRecord.permLink;
        return this.fetchRepliesFromSteemit(postId, postAuthor, postPermLink);
      })
      .then(result => {
        return ReplyModel.findAll({ where: { postId } })
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
        where: {id: replyObj.userId},
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
}
