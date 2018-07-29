const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const { merge } = require('lodash');

const { postTypeDefs, postResolver } = require('./resolvers/post_resolver');
const { commentTypeDefs, commentResovler } = require('./resolvers/comment_resolver');
const { userTypeDefs, userResolver } = require('./resolvers/user_resolver');

const typeDefs = `
type Query {
  getAllPosts: [Post]
  getPostReplies(author: String, permlink: String): String
  createPost: String
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

// Hey.  the type defs (endpoint signatures) and resovlers need to be kept in the same file or graphql throws an error.
// Think we should just merge these in the schema file for now...
const resolvers = merge(postResolver, commentResovler, userResolver);

const schema = makeExecutableSchema({
  typeDefs: [ typeDefs, postTypeDefs, commentTypeDefs, userTypeDefs ],
  resolvers
});

module.exports = schema;
