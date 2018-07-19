const { mergeResolvers } = require('merge-graphql-schemas');
const userResolver = require('./user');
const postResolver = require('./post');

const resolvers = [
  userResolver,
  postResolver,
];

module.exports = mergeResolvers(resolvers);
