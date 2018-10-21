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
  isDeleted: Boolean!
}

type Query {
  getAllPostReplies(postId: Int): [Reply]
  returnAllReplies: [Reply]
  replyCountById(postId: Int): Int
}

# input BroadcastReplyInput {
#   postId: Int!
#   body: String!
#   createdAt: Date!
# }

input BroadcastReplyInput {
  body: String;
  postPermLink: String
  postAuthor: String
}

type Mutation {
  # creates or edits a reply
  broadcastReply(input: BroadcastReplyInput): String
  # flags reply as deleted
  deleteReply(permLink: String): Reply
  # votes on a reply
  voteReply(permLink: String, up: Boolean): Reply
}
`;
