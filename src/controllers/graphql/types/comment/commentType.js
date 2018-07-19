const { AuthenticationError, gql } = require('apollo-server');
const { makeExecutableSchema }     = require('graphql-tools');

const typeDefs = gql`
  scalar Date

  type Query {
    allComments: [Comment]
  }

  type Mutation {
    createComment: Comment
    updateComment(commentId: String!): Comment
    deleteComment(commentId: String!): Comment
    voteComment(commentId: String!): Comment
  }

  type Comment {
    id: ID!
    createdAt: Date
    authorId: String
    postId: String
    body: String
    net_votes: Int!
  }
`;

const resolvers = {
  Query: {
    allComments: async (_, {}, { post }) => {
      return !post
        ? new AuthenticationError('NO_COMMENTS')
        : await CommentService.getAllComments();
    }
  },
  Mutation: {
    createComment: async (_, args) => {  // { accessToken: "gkjdshjklhj23kjhGFD", title: "Bitcoin is awesome", body: "This is my bitcoin post", tags: ["bitcoin", "ethereum"], author: "steemit", permlink: "firstpost" }
      return "success";
    },
    updateComment: async (_, args) => { // { accessToken: "gkjdshjklhj23kjhGFD", title: "Bitcoin is awsome", body: "This is my bitcoin post", tags: ["bitcoin", "ethereum"], author: "steemit", permlink: "firstpost" }
      return "success";
    },
    deleteComment: async (_, args) => { // { accessToken: "gkjdshjklhj23kjhGFD", author: "steemit", permlink: "firstpost" }
      return "success";
    },
    voteComment: async (_, args) => {
      return "success"  // { accessToken: "gkjdshjklhj23kjhGFD", author: "steemit", permlink: "firstpost", upvote: 0, vote_percent: 100 }
    }
  }
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
