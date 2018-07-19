// This is what you meant by post service right?

// TODO: create postService to communicate with model and import postService
// const Post = db.sequelize.models.post;

const db        = require('../models/sequelize/index');
const PostModel = db.sequelize.models.post;
const UserModel = db.sequelize.models.user;
const Op        = db.Sequelize.Op;
const _ = require('lodash');
const POSTS_PER_TAG = require('../utils/postsPerTag');
const VIDEO_URLS = require('../utils/videoUrls');

const determinePostType = links => {
   if (!links) {
     return 0;
   } else if (containsVideo(links)) {
     // is video
     return 1;
   } else {
     // news
     return 2;
   }
}

const linkContainsVideoUrl = (link) => {
  for (const videoUrl of VIDEO_URLS) {
    if (link.includes(videoUrl)) {
      return true;
    }
  }
}

const containsVideo = links => {
  for (let link of links) {
    if (linkContainsVideoUrl(link)) {
      return true;
    }
  }
    return false;
}

const postProperFormat = (post) => {
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
    postType: determinePostType(links),
    tag1: tags[0],
    tag2: tags[2],
    tag3: tags[3],
    tag4: tags[4],
    tag5: tags[5],
  }
};

const findOrCreatePost = (post, author, updateRankType) => {
  return PostModel
    .findOrCreate({
      where: {id: post.id},
      defaults: { ...postProperFormat(post), userId: author.id }
    }).spread((post, created) => {
      post.update(updateRankType);
    });
}

module.exports = {
  reSyncPosts: function(posts, rankType) {
    for (const [tagIndex, postsByTag] of Object.entries(posts)) {
      for (const [index, post] of Object.entries(postsByTag)) {
        const newRanking = (tagIndex) * POSTS_PER_TAG + parseInt(index);
        const updateRankType = {};
        updateRankType[rankType] = newRanking;
        UserModel
          .findOrCreate({
            where: {name: post.author},
            defaults: { id: _.random(10000)}
          })
          .spread((user, created) => {
            return findOrCreatePost(post, user, updateRankType);
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
  }
}
