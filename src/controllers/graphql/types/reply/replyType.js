const { AuthenticationError, gql } = require('apollo-server');

module.exports = gql `
scalar Date

type Reply {
  id: Int!
  commenter: User!
  post: Post!
  parent: Reply
  permLink: String!
  body: String!
  createdAt: Date!
  netVotes: Int!
  pendingPayoutValue: Float!
}

`;

// type Query {
//   getReplies(postId: Int): [Reply]
// }
