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
  constructor(postFromOurDb) {
    this.post = postFromOurDb;
    this.postAuthor;
    this.parent;
  }

  getAllComments() {
    return UserModel.findById(this.post.userId)
      .then(author => {
        this.postAuthor = author;
        return this.fetchRepliesFromSteemit({
          usersSteemitName: this.postAuthor.name,
          permLink: this.post.permLink,
        })
      })
      .catch(err => console.log("trouble adding replies to db: ", err));
  }
  // user and permlink can be info of the Steemit POST OR COMMENT
  fetchRepliesFromSteemit({ usersSteemitName, permLink }) {
    const addRepliesToDb = (replies) => {
      for (const reply of replies[0]) { // replies returned in 2-D array.  Our client.sendAsync supports multiple requests..
        this.addReplyToDb(reply);
      }
    }
    const params = [[ usersSteemitName, permLink]];
    return client.sendAsync(GET_CONTENT_REPLIES, params, addRepliesToDb);
  }

  addReplyToDb(steemitReply) {
    UserModel
      .findOrCreate({
        where: {name: steemitReply.author},
        defaults: { id: _.random(10000) }
      })
      .spread((commenter, created) => {
        return this.findOrCreateReply(steemitReply, commenter);
      });
  }

  findOrCreateReply(steemitReply, commenter) {
    return ReplyModel
      .findOrCreate({
        where: {id: steemitReply.id},
        defaults: { ...this.replyProperFormat(steemitReply), userId: commenter.id }
      })
      .spread((replyInOurDb, created) => {
        replyInOurDb.update({body: steemitReply.body})
          // NestedReplies require seperate calls to Steemit Api...
          // .then(replyInOurDb => {
          //   if (replyInOurDb.children && created) {
          //     return this.fetchRepliesFromSteemit({ usersSteemitName: steemitReply.name, permLink: steemitReply.permlink })
          //   }
          // });
      });
  }
  replyProperFormat(steemitReply) {
    const convertedValue = Number.parseFloat(steemitReply.pending_payout_value.split("SBD")[0]);
    return {
      postId: this.post.id,
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
