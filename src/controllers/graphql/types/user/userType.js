const { AuthenticationError, gql } = require('apollo-server');

module.exports = gql`
type User {
  id: String!
  name: String!
  createdAt: Date
  voteValue: String
  location: String
  realLifeName: String
  introBlurb: String
  reputationScore: String
  profileImageUrl: String
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
