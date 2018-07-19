const { mergeTypes } = require('merge-graphql-schemas');
const postType = require('./post');
const userType = require('./user');

const types = [
  postType,
  userType,
];

module.exports = mergeTypes(types);
