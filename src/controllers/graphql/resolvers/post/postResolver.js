const { AuthenticationError } = require('apollo-server');
const db = require('../../connectors');

const Post = db.sequelize.models.post;
const ReplyService = require('../../../../services/replyService');
const PostService = require('../../../../services/postService');
const { FETCH_TOP_X_POSTS } = require('../../../../utils/constants');

module.exports = {
  Query: {
    getAllPosts: async (_, args) => {
      return await Post.findAll({
        order: [['hot', 'ASC']],
        limit: FETCH_TOP_X_POSTS,
        where: { isDeleted: false },
      });
    },
    getPostsByType: async (_, { postType }) => { // Is either NEWS_POST, BLOG_POST, VIDEO_POST
      return await Post.findAll({ where: { postType } });
    },
    getPost: async (_, args) => {
      return await Post.findOne({ where: {
        id: args.postId,
        isDeleted: false,
      } });
    },
    getUserFeed: async (_, args, { authenticatedUserInstance }) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await authenticatedUserInstance.getMyFollowersPostsAndUsersAuthoredPosts();
    },
    getHundredxPosts: async (_, args) => {
      return await PostService.fetchHundredxResteemedPosts();
    },
  },
  Mutation: {
    broadcastPost: async (_, { permLink, title, body, tags }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await PostService.broadcastAndStorePost({ authenticatedUserInstance, permLink, title, body, tags });
    },
    deletePost: async(_, { permLink }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await PostService.deletePost({ permLink });
    },
    votePost: async(_, { permLink, up }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await PostService.votePost({ authenticatedUserInstance, permLink, up });
    }
  },
  Post: {
    author(post) {
      return post.getUser();
    },
    replies(post) {
      return post.getReplies();
    },
  }
};
