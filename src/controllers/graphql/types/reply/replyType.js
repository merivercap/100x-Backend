const { AuthenticationError, gql } = require('apollo-server');

// permLink format: commentauthor-re-postauthorpostPermLink
// $ curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_content_replies", "params":["niko79542", "a-post-by-niko"], "id":1}' https://api.steemit.com

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
  broadcastReply(postId: Int, permLink: String, body: String): Reply
}
`;
