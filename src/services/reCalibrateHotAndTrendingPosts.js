const logger       = require('./logger');
const db           = require('../models/sequelize');
const PostService  = require('./postService');
const client       = require('./steem');
const _            = require('lodash');

const {
  FETCH_POSTS_PER_TAG,
  GET_DISCUSSIONS_BY_HOT,
  GET_DISCUSSIONS_BY_TRENDING,
  HOT,
  TRENDING
}                  = require('../utils/constants');
// const taggings     = require('../utils/taggings');
const taggings     = [ 'bitcoin' ];


const batchUpdate = () => {
  const params = taggings.map(tag => [{ "tag": tag, "limit": FETCH_POSTS_PER_TAG }] );
  client.sendAsync(GET_DISCUSSIONS_BY_HOT, params, calibrateHotPostRankings);
  client.sendAsync(GET_DISCUSSIONS_BY_TRENDING, params, calibrateTrendingPostRankings);
};

const calibrateHotPostRankings = (posts) => {
  return PostService.resetRanking(HOT)
    .then(PostService.reSyncPosts(posts, HOT))
    .catch(err => console.log(err, 'err syncing hot posts'));
}

const calibrateTrendingPostRankings = (posts) => {
  return PostService.resetRanking(TRENDING)
    .then(PostService.reSyncPosts(posts, TRENDING))
    .catch(err => console.log(err, 'err syncing trending posts'));
}

module.exports = batchUpdate;
