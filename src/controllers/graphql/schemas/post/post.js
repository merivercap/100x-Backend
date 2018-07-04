const { AuthenticationError, gql } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

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

const typeDefs = `
  scalar Date

  type Query {
    allPosts: [Post]
    getPostContent(message: String, params: [String]): String
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

module.exports = makeExecutableSchema({ typeDefs, resolvers });

