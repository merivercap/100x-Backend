const { mergeTypes } = require('merge-graphql-schemas');
const userType = require('./user');
const postType = require('./post');
const replyType = require('./reply');

const types = [
  userType,
  postType,
  replyType,
];

module.exports = mergeTypes(types);
