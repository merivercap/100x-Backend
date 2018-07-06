const { AuthenticationError, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

// const db = require('../connectors');
// TODO: create postService to communicate with model and import postService
// const Post = db.sequelize.models.post;
const { Post } = require('../../../../models/sequelize');

console.log('*****', Post);

const { GraphQLScalarType } = require('graphql');
const { merge } = require('lodash');

// https://developers.steem.io/apidefinitions/#condenser_api.get_discussions_by_blog
// This end point will retrieve posts/discussions by tag, eg. bitcoin

/*
POST TABLE EXPLANATION

type Post {
  id: Int!
  author: String!
  permlink: String!
  tag1: String!                | eg. bitcoin, beyondbitocin, crypto  There should be at least 1 tag.
  tag2: String                 |
  tag3: String
  tag4: String
  tag5: String
  title: String!               | eg. Trump releases Tweet Storm
  body: String!                | eg. I love blogging on steeem
  created: Date!
  net_votes: Int!              | number of upvotes, eg. 300
  children: Int!               | eg. 100.  Number of replies to this post.
  curator_payout_value: Float! | eg. $123, payout value of post.
  trending: Int               | eg. 1, 2, 3, 4.  Lower values are trending
  hot: Int
  post_type: Int!              | eg. 0 => Blog, 1 => Video, 2 => News
}

*/

const typeDefs = gql`
  scalar Date

  type Query {
    getAllPosts: [Post]
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
    author: String!
    permlink: String!
    tag1: String!
    tag2: String
    tag3: String
    tag4: String
    tag5: String
    title: String!
    body: String!
    created: Date!
    net_votes: Int!
    children: Int!
    curator_payout_value: Float!
    trending: Int
    hot: Int
    post_type: Int!
  }
`;

const resolvers = {
  Query: {
    getAllPosts: async (_, args) => {
      return Post.findAll({ order: [['hot', 'ASC']] });
    },
    getPostReplies: async (_, args) => {
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
