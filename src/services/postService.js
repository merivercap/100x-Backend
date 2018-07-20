const db           = require('../models/sequelize');
const PostModel    = db.sequelize.models.post;
const UserModel    = db.sequelize.models.user;
const Op           = db.Sequelize.Op;
const _            = require('lodash');
const ReplyService = require('./replyService');
const {
  FETCH_POSTS_PER_TAG
}                  = require('../utils/constants');
const VIDEO_URLS   = require('../utils/videoUrls');

module.exports = {
  reSyncPosts: function(posts, rankType) {
    for (const [tagIndex, postsByTag] of Object.entries(posts)) {
      for (const [index, post] of Object.entries(postsByTag)) {
        const newRanking = (tagIndex) * FETCH_POSTS_PER_TAG + parseInt(index);
        const updateRankType = {};
        updateRankType[rankType] = newRanking;
        UserModel
          .findOrCreate({
            where: {name: post.author},
            defaults: { id: _.random(10000)}
          })
          .spread((user, created) => {
            return this.findOrCreatePost(post, user, updateRankType);
          });

      }
    }
  },
  resetRanking: function(rankType) {
     //updates all posts of rankType, since children is always greater than 0
     const keyVal = {};
     keyVal[rankType] = 9999;
    return PostModel.update(keyVal, {
      where: {children: {[Op.gte]: 0} }
    })
      .catch(err => console.log(err));
  },
  determinePostType: function(links) {
     if (!links) {
       // blog
       return 0;
     } else if (this.containsVideo(links)) {
       // is video
       return 1;
     } else {
       // news
       return 2;
     }
  },
  linkContainsVideoUrl: function(link) {
    for (const videoUrl of VIDEO_URLS) {
      if (link.includes(videoUrl)) {
        return true;
      }
    }
  },
  containsVideo: function(links) {
    for (let link of links) {
      if (this.linkContainsVideoUrl(link)) {
        return true;
      }
    }
      return false;
  },
  postProperFormat: function(post) {
    const metadata = JSON.parse(post.json_metadata);
    const convertedValue = Number.parseFloat(post.pending_payout_value.split("SBD")[0]);
    const tags = metadata.tags;
    const links = metadata.links;
    return {
      permLink: post.permlink,
      title: post.title,
      body: post.body,
      createdAt: post.created,
      netVotes: post.net_votes,
      children: post.children,
      pendingPayoutValue: convertedValue,
      postType: this.determinePostType(links),
      tag1: tags[0],
      tag2: tags[2],
      tag3: tags[3],
      tag4: tags[4],
      tag5: tags[5],
    }
  },
  findOrCreatePost: function(post, author, updateRankType) {
    return PostModel
      .findOrCreate({
        where: {id: post.id},
        defaults: { ...this.postProperFormat(post), userId: author.id }
      }).spread((post, created) => {
        if (created) {
          const replyFetcher = new ReplyService(post);
          return post.update(updateRankType)
            .then(replyFetcher.getAllComments());
        } else {
          return post.update(updateRankType);
        }
      });
  },
}
