const logger = require('./logger');
const db = require('../models/sequelize/index');
const PostService = require('./postService');
const client = require('./steem');
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
}


module.exports = batchUpdate;
