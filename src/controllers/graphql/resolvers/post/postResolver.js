const { AuthenticationError } = require('apollo-server');
const db = require('../../connectors');

const Post = db.sequelize.models.post;
const ReplyService = require('../../../../services/replyService');

module.exports = {
  Query: {
    getAllPosts: async (_, args, { user }) => {
      return await Post.findAll({order: [['hot', 'ASC']], limit: 100});
    },
    getPost: async (_,args) => {
      return await Post.findById(args.postId);
    },
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
