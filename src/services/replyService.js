const db         = require('../models/sequelize');
const models     = db.sequelize.models;
const PostModel  = models.post;
const UserModel  = models.user;
const ReplyModel = models.reply;
const Op         = db.Sequelize.Op;
const _          = require('lodash');
const client     = require('./steem');

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
        // store post info...
        this.postAuthor = postRecord.userId;
        this.postPermLink = postRecord.permLink;
        return this.fetchRepliesFromSteemit();
      })
      .then(result => {
        return ReplyModel.findAll({ where: { postId: this.postId } })
      })
      .catch(err => {
        console.log(err, "post doesnt exist in the db, or error fetching replies.");
      })
  }

  fetchRepliesFromSteemit(options = {}) {
    // if (options.parent) {
    //   const params = [[ options.parent.userId, options.parent.permLink ]];
    //   const parentId = options.parent.id;
    // } else {
    //   const params = [[ this.postAuthor, this.postPermLink ]];
    //   const parentId = null;
    // }
    // let that = this;

    const addRepliesToDb = (replies) => {
       const storeAllReplies = replies[0].map(steemitReply => {
         const formattedReply = {...this.replyProperFormat(steemitReply)};
         return this.addReplyToDb(formattedReply)
       });
       return Promise.all(storeAllReplies);
     }


     const params = [[ this.postAuthor, this.postPermLink]];
     return client.sendAsync(GET_CONTENT_REPLIES, params, addRepliesToDb);
  }

  addReplyToDb(replyObj) {
    return UserModel
      .findOrCreate({
        where: {id: replyObj.userId},
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
            // console.log("\n\n\n\n\n\\FEGTHINC REPLIES FOR \n\n\n\n\n\n\n", replyInOurDb.userId, replyInOurDb.permLink);
            this.fetchRepliesFromSteemit({ parent: replyInOurDb })
        }
      })
      .catch(err => console.log("trouble finding or creating reply", err));
  }
  replyProperFormat(steemitReply) {
    const convertedValue = Number.parseFloat(steemitReply.pending_payout_value.split("SBD")[0]);
    return {
      id: steemitReply.id,
      postId: this.postId,
      userId: steemitReply.author,
      permLink: steemitReply.permlink,
      body: steemitReply.body,
      createdAt: steemitReply.created,
      netVotes: steemitReply.net_votes,
      pendingPayoutValue: convertedValue,
      depth: steemitReply.depth,
      children: steemitReply.children,
    }
  }
}

module.exports = ReplyService;
