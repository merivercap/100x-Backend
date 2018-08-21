const db = require('../../connectors');
const Post = db.sequelize.models.post;
const PostService = require('../../../../services/postService');
const { FETCH_TOP_X_POSTS } = require('../../../../utils/constants');
const {
  AuthenticationError,
  gql,
  makeExecutableSchema,
} = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Query {
    getAllPosts: [Post]
    getPostById(id: ID!): Post
    getFollowerPosts: [Post]
    getHundredxPosts: [Post]
    # getTextPosts: [Post]
    # getNewsPosts: [Post]
    # getVideoPosts: [Post]
    # getTrendingPosts(trending: String): [Post]
    # getPostsByTags(tags: [String]): [Post]
  }

  type Mutation {
    createPost(post: Post!): Post
    updatePost(post: Post!): Post
    deletePost(id: ID!): boolean # Return boolean if delete was successful or not
  }

  type Post {
    id: ID!
    title: String
    body: String
    authorId: String
    # Other post values
  }
`;

const resolvers = {
  Query: {
    getAllPosts: async (_, args) => {
      return await Post.findAll({
        order: [['hot', 'ASC']],
        limit: FETCH_TOP_X_POSTS
      });
    },

    getPostById: async (_, { postId }) => {
      return await Post.findById(postId);
    },

    getFollowerPosts: async (_, args, { authenticatedUserInstance }) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('INVALID_USER');
      }
      return await authenticatedUserInstance.getMyFollowersPosts();
    },

    getHundredxPosts: async (_, args) => {
      return await PostService.fetchHundredxResteemedPosts();
    }

    // getTextPosts: async(_, args) => {
    //   return await PostService.fetchTextPosts();
    // },

    // getNewsPosts: async(_, args) => {
    //   return await PostService.fetchNewsPosts();
    // },

    // getVideoPosts: async(_, args) => {
    //   return await PostService.fetchVideoPosts();
    // },

    // getTrendingPosts: async(_, { trending }) => {
    //   return await PostService.getTrendingPosts(trending);
    // },

    // getPostsByTags: async(_, { tags }) => {
    //   return await PostService.getPostsByTags(tags);
    // }
  },
  Mutation: {
    // createPost: async (_, { post }, { authenticatedUserInstance }) => {
    //   if (!authenticatedUserInstance) {
    //     throw new AuthenticationError('INVALID_USER');
    //   }
    //   return PostService.createPost(post);
    // },

    // updatePost: async (_, { post }, { authenticatedUserInstance }) => {
    //   if (!authenticatedUserInstance) {
    //     throw new AuthenticationError('INVALID_USER');
    //   }
    //   return PostService.updatePost(post);
    // },

    // deletePostById: async(_, { id }, { authenticatedUserInstance  }) => {
    //   if (!authenticatedUserInstance) {
    //     throw new AuthenticationError('INVALID_USER');
    //   }
    //   return PostService.deletePostById(id);
    // },
  },
  /** Same with this. What is this doing?  */
  Post: {
    author(post) {
      return post.getUser();
    },
    replies(post) {
      return post.getReplies();
    }
  }
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
