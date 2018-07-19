const { AuthenticationError, gql } = require('apollo-server');

module.exports = gql`
type User {
  id: Int!
  createdAt: Date
  name: String
  posts: [Post]
}

type Query {
  user(name: String): User
  allUsers: [User]
}
`;
