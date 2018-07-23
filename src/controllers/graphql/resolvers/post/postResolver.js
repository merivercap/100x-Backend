const { AuthenticationError } = require('apollo-server');
const db = require('../../connectors');

const Post = db.sequelize.models.post;
const ReplyService = require('../../../../services/replyService');

module.exports = {
  Query: {
    getAllPosts: async (_, args) => {
      return await Post.findAll({order: [['hot', 'ASC']], limit: 100});
    },
    getPost: async (_,args) => {
      return await Post.findById(args.postId);
    },
    getFollowerPosts: async (_, args, { authenticatedUserInstance }) => {
      return !authenticatedUserInstance
        ? new AuthenticationError('ERROR_GETTING_FOLLOWER_POSTS')
        : await authenticatedUserInstance.getUsersFollowerPosts();
    }
  },
  Post: {
    author(post) {
      return post.getUser();
    },
    replies(post) {
      return post.getReplies();
    }
  }
};
