const { AuthenticationError, gql } = require('apollo-server');

module.exports = gql `
scalar Date

type Post {
  id: Int!
  author: User!
  replies: [Reply]
  permLink: String!
  title: String!
  body: String!
  createdAt: Date!
  netVotes: Int!
  children: Int!
  pendingPayoutValue: Float!
  trending: Int
  hot: Int
  postType: String!
  tag1: String!
  tag2: String
  tag3: String
  tag4: String
  tag5: String
  isDeleted: Boolean!
}

type Query {
  getAllPosts: [Post]
  getPost(postId: Int): Post
  getFollowerPosts: [Post]
  getHundredxPosts: [Post]
}

type Mutation {
  # creates or edits a post
  broadcastPost(permLink: String, title: String, body: String, tags: [String]): Post
  # flags post as deleted
  deletePost(permLink: String): Post
  # votes on a post
  votePost(permLink: String, up: Boolean): Post
}
`;
