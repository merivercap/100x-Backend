const { AuthenticationError, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const User = require('../../connectors/connectors');

const typeDefs = gql`
  scalar Date

  type Query {
    user(name: String): User
    allUsers: [User]
    getLoginLink: String
  }

  type User {
    id: Int!
    createdAt: Date
    name: String
    posts: [Post]
  }
`;

const resolvers = {
  Query: {
    user(_, args) {
      return User.find({ where: args });
    },
    allUsers: async (_, { }, { post }) => {
      // return !post
      //   ? new AuthenticationError('UNAUTHORIZED_USER')
      //   : await CommentService.getallUsers();
    },
    getLoginLink: async (_, args) => {
      return "https://steemconnect.com/oauth2/authorize?client_id";
    },
  },
  User: {
    posts(user) {
      return user.getPosts();
    }
  }
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
