const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const { merge } = require('lodash');

const { postTypeDefs, postResolver } = require('./resolvers/post_resolver');
const { commentTypeDefs, commentResovler } = require('./resolvers/comment_resolver');
const { userTypeDefs, userResolver } = require('./resolvers/user_resolver');

const typeDefs = `
type Query {
  getAllPosts: [Post]
  getPostReplies(author: String, permlink: String): String
  createNewPost: String
  updatePost: String
  deletePost: String
  votePost: String
  createNewComment: String
  updateComment: String
  deleteComment: String
  voteComment: String
  getLoginLink: String
}
`;

const schema = makeExecutableSchema({
  typeDefs: [ typeDefs, postTypeDefs, commentTypeDefs, userTypeDefs ],
  resolvers: merge(postResolver, commentResovler, userResolver)
});

module.exports = schema;
