const { AuthenticationError } = require('apollo-server');
const db = require('../../connectors');

const Post = db.sequelize.models.post;
const ReplyService = require('../../../../services/replyService');
const PostService = require('../../../../services/postService');
const { FETCH_TOP_X_POSTS } = require('../../../../utils/constants');

module.exports = {
  Query: {
    getAllPosts: async (_, args) => {
      return await Post.findAll({order: [['hot', 'ASC']], limit: FETCH_TOP_X_POSTS});
    },
    getPost: async (_,args) => {
      return await Post.findById(args.postId);
    },
    getFollowerPosts: async (_, args, { authenticatedUserInstance }) => {
      if (!authenticatedUserInstance) {
        return new AuthenticationError('ERROR_GETTING_FOLLOWER_POSTS');
      }
      return await authenticatedUserInstance.getMyFollowersPosts();
    },
    getHundredxPosts: async (_, args) => {
      return await PostService.fetchHundredxResteemedPosts();
    },
  },
  Mutation: {
    broadcastPost: async (_, { permLink, title, body, tags }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        return new AuthenticationError('ERROR_CREATING_OR_EDITING_POST');
      }
      return await PostService.broadcastAndStorePost({ authenticatedUserInstance, permLink, title, body, tags });
    },
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
