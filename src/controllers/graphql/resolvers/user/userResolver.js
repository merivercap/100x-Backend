const db = require('../../connectors');
const User = db.sequelize.models.user;
const UserService = require('../../../../services/userService');
const {
  AuthenticationError,
  gql,
  makeExecutableSchema
} = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Query {
    getAllUsers: [User]
    # Changed from getUserByArgs so not sure if getUserById will work yet
    # getUserById(id: ID!): User
  }

  type Mutation {
    # updateUser(user: User!): User
    # deleteUserById(id: ID!): boolean; # Return boolean based on delete success/fail
  }

  type User {
    created: Date
    id: ID!
    name: String
    profilePicUrl: String
    updatedAt: Date
  }
`;

const resolvers = {
  Query: {
    getAllUsers: async (_, args) => {
      return await UserService.getAllUsers();
    },

    getUserById: async (_, { id }) => {
      return await UserService.getUserById(id);
    },

    follow: async (_, args, { authorizedUser }) => {
      if (!authorizedUser) {
        throw new AuthenticationError('INVALID_USER')
      }
      return await authorizedUser.followSteemUser(
        args.steemUsernameToFollow
      );
    },

    unfollow: async (_, args, { authorizedUser }) => {
      if (!authorizedUser) {
        throw new AuthenticationError('INVALID_USER');
      }
      return await authorizedUser.unFollowSteemUser(
        args.steemUsernameToUnfollow
      );
    }
  },
  // Mutation: {
  //   updateUser: async (_, { user }, { authorizedUser }) => {
  //     if (!authorizedUser) {
  //       throw new AuthenticationError('INVALID_USER');
  //     }
  //     return await UserService.updateUser(user);
  //   },

  //   deleteUserById: async(_, { id }, { authorizedUser }) => {
  //     if (!authorizedUser) {
  //       throw new AuthenticationError('INVALID_USER');
  //     }
  //     return await UserService.deleteUserById(id);
  //   }

      // login: async(_, { userCredentials }, { authorizedUser }) => {
      //   if (!authorizedUser) {
      //     throw new AuthenticationError('INVALID_USER');
      //   }
      //   return await UserService.login(userCredentials);
      // }
  // },
  /** What is this User hash for? */
  User: {
    posts(author) {
      return author.getPosts();
    },
    replies(commenter) {
      return commenter.getReplies();
    }
  }
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
