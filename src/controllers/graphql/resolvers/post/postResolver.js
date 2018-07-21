const { AuthenticationError } = require('apollo-server');
const db = require('../../connectors');

const Post = db.sequelize.models.post;
const ReplyService = require('../../../../services/replyService');

module.exports = {
  Query: {
    getAllPosts: async (_, args, { user }) => {
      return await Post.findAll({order: [['hot', 'ASC']], limit: 100});
      // example of user authentication require posts
      // return !user
      //   ? new AuthenticationError('ERROR_CREATING_POST')
      //   : await Post.findAll({order: [['hot', 'ASC']], limit: 100});
    },
    getPost(_,args) {
      return Post.findById(args.postId);
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
