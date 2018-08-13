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

<<<<<<< HEAD
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
=======
module.exports = {
  //Reason I build this was cause the fields from the steem api don't come in exactly as we need them.
  // for example, the tags come in in the json_metadata field.  Also the hot and trending ranks are our own ...
  // I guess we could construct a post properly somewhere else, and then just call PostModel.create(post) ??
  // Ill try to get to it tmrw...
  // Maybe something like this...
  // createPost: function(post) => {
  //   PostModel.create(post);
  // };

  createPost: function(post, { newHotRanking }) {
    const metadata = JSON.parse(post.json_metadata);
    const convertedValue = Number.parseFloat(post.pending_payout_value.split("SBD")[0]);
    const tags = metadata.tags;
    PostModel.create({
      id: post.id,
      authorId: post.author,
      permLink: post.permlink,
      title: post.title,
      body: post.body,
      createdAt: post.created,
      netVotes: post.net_votes,
      children: post.children,
      pendingPayoutValue: convertedValue,
      trending: 1,
      hot: newHotRanking,
      postType: 0,
      tag1: tags[0],
      tag2: tags[1],
      tag3: tags[2],
      tag4: tags[3],
      tag5: tags[4],
    })
    .catch(err => {
      console.log('Error creating post: ', err);
    });;
  },
  updatePostRanking: function(options) {
    const postId = options.postId || '';
    const newHotRanking = options.newHotRanking || null;
    const newTrendingRanking = options.newTrendingRanking || null;
>>>>>>> master

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

const findOrCreatePost = (post, user, updateRankType) => {
  return PostModel
    .findOrCreate({
      where: {id: post.id},
      defaults: { ...postProperFormat(post), userId: user.id }
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
