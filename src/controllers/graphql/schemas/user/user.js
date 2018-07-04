const { AuthenticationError, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = gql`
  type Query {
    allUsers: [User]
    getLoginLink(): String
  }


  type User {
    id: ID!
    createdAt: Date
    name: String
  }
`;

const resolvers = {
  Query: {
    allUsers: async (_, { }, { post }) => {
      return !post
        ? new AuthenticationError('UNAUTHORIZED_USER')
        : await CommentService.getallUsers();
    },
    getLoginLink: async (_, args) => {
      return "https://steemconnect.com/oauth2/authorize?client_id";
    },
  },
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
