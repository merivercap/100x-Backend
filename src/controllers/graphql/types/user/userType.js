const { AuthenticationError, gql } = require('apollo-server');

module.exports = gql`
type User {
  id: Int!
  createdAt: Date
  name: String
  posts: [Post]
  replies: [Reply]
}

type Query {
  getUserByArgs(name: String): User
  getAllUsers: [User]
  follow(steemUsernameToFollow: String): User
  unfollow(steemUsernameToUnfollow: String): User
}
`;
