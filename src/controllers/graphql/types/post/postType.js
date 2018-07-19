const { AuthenticationError, gql } = require('apollo-server');

module.exports = gql `
scalar Date

type Post {
  id: Int!
  author: User
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
}

type Query {
  getAllPosts: [Post]
  getPost(postId: Int): Post
}
`;
