const { client } = require('../../server/steemAPI');
const db = require('../connectors');
const Post = db.sequelize.models.post;

const { GraphQLScalarType } = require('graphql');
const { merge } = require('lodash');

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

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

const postTypeDefs = `
  scalar Date

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

const postResolver = {
  Query: {
    getAllPosts(_, args) {
      return Post.findAll({order: [['hot', 'ASC']]});
    },
    getPostReplies(_, args) {
      return client.sendAsync(args.message, [args.params], (result) => {return result}); // e.g. message: "get_content_replies", params: ["steemit", "firstpost"]
    },
    createNewPost(_, args) {
      return "success";
    },
    updatePost(_, args) {
      return "success";
    },
    deletePost(_, args) {
      return "success";
    },
    votePost(_, args) {
      return "success"
    }
  }
};

module.exports = {
  postTypeDefs,
  postResolver,
}
