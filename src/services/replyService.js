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

class ReplyService {
  constructor({ postId }) {
    this.postId = postId;
    this.postAuthor;
    this.postPermLink;
  }

  fetchAllPostReplies() {
    return PostModel.findById(this.postId) //find post
      .then(postRecord => {
        this.postPermLink = postRecord.permLink;
        return UserModel.findById(postRecord.userId);
      })
      .then(userRecord => {
        // store post info...
        this.postAuthor = userRecord.name;
        return this.fetchRepliesFromSteemit();
      })
      .then(result => {
        return ReplyModel.findAll({ where: { postId: this.postId } })
      })
      .catch(err => {
        console.log(err, "post doesnt exist in the db, or error fetching replies.");
      })
  }

  fetchRepliesFromSteemit(options) {
    const {
      params,
      parentId
    } = this.determineParamOptions(options);
    console.log("the params are", params);
    const addRepliesToDb = (replies) => {
       const storeAllReplies = replies[0].map(steemitReply => {
         const formattedReply = {...this.replyProperFormat(steemitReply), parentId};
         return this.addReplyToDb(formattedReply, steemitReply.author);
       });
       return Promise.all(storeAllReplies);
     }

     return client.sendAsync(GET_CONTENT_REPLIES, params, addRepliesToDb);
  }

  addReplyToDb(replyObj, authorUserName) {
    return UserModel
      .findOrCreate({
        where: {id: authorUserName + idGenerator.generate() },
        defaults: { name: authorUserName }
      })
      .spread((commenter, created) => {
        return this.findOrCreateReply(replyObj, commenter);
      })
      .catch(err => console.log("trouble adding replies to db", err));
  }

  findOrCreateReply(replyObj, commenter) {
    return ReplyModel
      .findOrCreate({
        where: {id: replyObj.id},
        defaults: { ...replyObj, userId: commenter.id }
      })
      .spread((replyInOurDb, created) => {
        if (replyInOurDb.children > 0 && created) {
          return this.fetchRepliesFromSteemit({ parentReply: replyInOurDb });
        }
      })
      .catch(err => console.log("trouble finding or creating reply", err));
  }
  replyProperFormat(steemitReply) {
    const convertedValue = Number.parseFloat(steemitReply.pending_payout_value.split("SBD")[0]);
    return {
      id: steemitReply.id,
      postId: this.postId,
      permLink: steemitReply.permlink,
      body: steemitReply.body,
      createdAt: steemitReply.created,
      netVotes: steemitReply.net_votes,
      pendingPayoutValue: convertedValue,
      depth: steemitReply.depth,
      children: steemitReply.children,
    }
  }

  determineParamOptions(options = {}) {
    let params;
    let parentId;
    if (options.parentReply) {
      params = [[ options.parentReply.userId, options.parentReply.permLink ]];
      parentId = options.parentReply.id;
    } else {
      params = [[ this.postAuthor, this.postPermLink ]];
      parentId = null;
    }

    return {
      params, parentId
    };
  }
}

module.exports = ReplyService;
