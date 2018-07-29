const { AuthenticationError, gql } = require('apollo-server');

module.exports = gql `
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
  children: Int!
  depth: Int!
}

type Query {
    getAllPostReplies(postId: Int): [Reply]
}

`;
