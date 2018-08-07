const logger = require('./logger');
const db = require('../models/sequelize/index');
const PostService = require('./postService');
const client = require('./steem');
<<<<<<< HEAD
const _ = require('lodash');

const taggings = require('../utils/taggings');
// const taggings = [ 'bitcoin' ];
const POSTS_PER_TAG = require('../utils/postsPerTag');


const batchUpdate = () => {
  const params = taggings.map(tag => [{ "tag": tag, "limit": POSTS_PER_TAG }] );
  client.sendAsync('get_discussions_by_hot', params, calibrateHotPostRankings);
  client.sendAsync('get_discussions_by_trending', params, calibrateTrendingPostRankings);
};

const calibrateHotPostRankings = (posts) => {
  return PostService.resetRanking('hot')
    .then(PostService.reSyncPosts(posts, 'hot'));
}

const calibrateTrendingPostRankings = (posts) => {
  return PostService.resetRanking('trending')
    .then(PostService.reSyncPosts(posts, 'trending'));
=======
// const taggings = require('../utils/taggings');
const taggings = [ 'ethereum' ];
const TOP_X_TAGS_PER_POST = 10;


const batchUpdate = () => {
  const params = taggings.map(tag => [{ "tag": tag, "limit": TOP_X_TAGS_PER_POST }] );
  client.sendAsync('get_discussions_by_hot', params, calibrateNewPostRankings);
};

const calibrateNewPostRankings = (result) => {
  PostService.resetRanking('hot')
    .then(() => {
      for (let index = 0; index < result[0].length; index++) {
        for (let tagIndex = 0; tagIndex < result.length; tagIndex++) {
          let newHotRanking = index * 10 + tagIndex;
          let post = result[tagIndex][index];
          updateIfUnique(post, { newHotRanking });
        }
      }
    })
    .catch(error => {
      logger.error(`ERROR: `, error);
    });
>>>>>>> master
}


module.exports = batchUpdate;
