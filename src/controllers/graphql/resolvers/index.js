const { mergeResolvers } = require('merge-graphql-schemas');
const userResolver = require('./user');
const postResolver = require('./post');
const replyResolver = require('./reply');

const resolvers = [
  userResolver,
  postResolver,
  replyResolver,
];

module.exports = mergeResolvers(resolvers);
