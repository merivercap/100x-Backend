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
    returnAllReplies: [Reply]
    replyCountById(postId: Int): Int
}

type Mutation {
  # creates or edits a reply
  broadcastReply(postId: Int, body: String): Reply
}
`;
