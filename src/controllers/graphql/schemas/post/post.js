const { AuthenticationError, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

// const db = require('../connectors');
// TODO: create postService to communicate with model and import postService
// const Post = db.sequelize.models.post;
// const { Post } = require('../../../../models/sequelize');
const Post = require('../../connectors/connectors');

const { GraphQLScalarType } = require('graphql');
// https://developers.steem.io/apidefinitions/#condenser_api.get_discussions_by_blog
// This end point will retrieve posts/discussions by tag, eg. bitcoin

const typeDefs = gql`
  scalar Date

  type Query {
    getAllPosts: [Post]
    getPost(postId: Int): Post
    getPostReplies(message: String, params: [String]): String
  }

  type Mutation {
    createPost: Post
    updatePost: Post
    deletePost: String
    votePost: String
  }

  type Post {
    id: Int!
    authorId: String!
    permLink: String!
    title: String!
    body: String!
    createdAat: Date!
    netVotes: Int!
    children: Int!
    pendingPayoutValue: Float!
    trending: Int
    hot: Int
    postType: Int!
    tag1: String!
    tag2: String
    tag3: String
    tag4: String
    tag5: String
  }
`;

const resolvers = {
  Query: {
    getAllPosts: async (_, args) => {
      console.log('getting all posts');
      return Post.findAll({order: [['hot', 'ASC']], limit: 100});
    },
    getPost(_,args) {
      return Post.findById(args.postId);
    },
    getPostReplies: async (_, args) => {
      console.log('getting post replies');
      return steemService.sendAsync('get_content_replies', [[args.author, args.permlink]], result => result[0][0].body ); // { author: 'steemit', permlink: 'firstpost' }
    },
  },
  Mutation: {
    createPost: async (_, { }, { post }) => {  // { accessToken: 'kjhDG5THrg', title: 'Bitcoin is awesome', body: 'This is my bitcoin post', tags: ['bitcoin', 'ethereum'], author: 'steemit', permlink: 'firstpost' }
      return 'success';
      // return !post
      //   ? new AuthenticationError('ERROR_CREATING_POST')
      //   : await PostService.createPost()
    },
    updatePost: async (_, args) => {  // { accessToken: 'kjhDG5THrg', title: 'Bitcoin is awsome', body: 'This is my bitcoin post', tags: ['bitcoin', 'ethereum'], author: 'steemit', permlink: 'firstpost' }
      return 'success';
    },
    deletePost: async (_, args) => { // { accessToken: 'kjhDG5THrg', author: 'steemit', permlink: 'firstpost' }
      return 'success';
    },
    votePost: async (_, args) => { // { accessToken: 'kjhDG5THrg', author: 'steemit', permlink: 'firstpost', upvote: 1, vote_percent: 50 }
      return 'success'
    }
  }
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
