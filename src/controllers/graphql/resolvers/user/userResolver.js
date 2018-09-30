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
    follow: async (_, args, { authenticatedUserInstance }) => {
      return !authenticatedUserInstance
        ? new AuthenticationError('ERROR_FOLLOWING_USER')
        : await authenticatedUserInstance.followSteemUser(args.steemUsernameToFollow);
    },
    unfollow: async (_, args, { authenticatedUserInstance }) => {
      return !authenticatedUserInstance
        ? new AuthenticationError('ERROR_UNFOLLOWING_USER')
        : await authenticatedUserInstance.unFollowSteemUser(args.steemUsernameToUnfollow);
    },
    getProfileInformation: async (_, args) => {
      return await UserService.getUserProfileInfo(args.name);
    },
    claimRewardBalance: async (_, args, { authenticatedUserInstance }) => {
      return !authenticatedUserInstance
        ? new AuthenticationError('ERROR_CLAIMING_REWARD_BALANCE')
        : await authenticatedUserInstance.claimUsersRewardBalance();
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
