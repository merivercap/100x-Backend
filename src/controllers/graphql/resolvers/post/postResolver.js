const db = require('../../connectors');

const Post = db.sequelize.models.post;

module.exports = {
  Query: {
    getAllPosts: async (_, args) => {
      return Post.findAll({order: [['hot', 'ASC']], limit: 100});
    },
    getPost(_,args) {
      return Post.findById(args.postId);
    },
  },
  Post: {
    author(post) {
      return post.getUser();
    }
  }
};
