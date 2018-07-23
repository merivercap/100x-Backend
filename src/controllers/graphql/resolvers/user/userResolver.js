const { AuthenticationError } = require('apollo-server');
const db = require('../../connectors');
const User = db.sequelize.models.user;

module.exports = {
  Query: {
    user(_, args) {
      return User.find({ where: args });
    },
    follow: async (_, args, { user, authenticatedUserInstance }) => {
      return !user
        ? new AuthenticationError('ERROR_FOLLOWING_USER')
        : await authenticatedUserInstance.followSteemUser(args.steemUsernameToFollow);
    },
    unfollow: async (_, args, { user, steemUser }) => {
      return !user
        ? new AuthenticationError('ERROR_UNFOLLOWING_USER')
        : await authenticatedUserInstance.unFollowSteemUser(args.steemUsernameToUnfollow);
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
