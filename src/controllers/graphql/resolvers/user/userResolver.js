const { AuthenticationError } = require('apollo-server');
const db = require('../../connectors');
const User = db.sequelize.models.user;
const UserService = require('../../../../services/userService');

module.exports = {
  Query: {
    getUserByArgs: async(_, args) => {
      return await User.find({ where: args });
    },
    getAllUsers: async (_, args) => {
      return await User.findAll();
    },
    follow: async (_, { steemUsernameToFollow }, { authenticatedUserInstance }) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await authenticatedUserInstance.followSteemUser(steemUsernameToFollow);
    },
    unfollow: async (_, { steemUsernameToUnfollow }, { authenticatedUserInstance }) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await authenticatedUserInstance.unFollowSteemUser(steemUsernameToUnfollow);
    },
    getProfileInformation: async (_, { name }) => {
      return await UserService.getUserProfileInfo(name);
    },
    claimRewardBalance: async (_, args, { authenticatedUserInstance }) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await UserService.claimUsersRewardBalance();
    }
  },
  User: {
    posts(author) {
      return author.getPosts();
    },
    replies(commenter) {
      return commenter.getReplies();
    }
  }
};
