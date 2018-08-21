const db = require('../../connectors');
const Reply = db.sequelize.models.reply;
const ReplyService = require('../../../../services/replyService');
const {
  AuthenticationError,
  gql,
  makeExecutableSchema
} = require('apollo-server');

const typeDefs = gql`
  scalar Date

  type Query {
    getAllRepliesByPostId: [Reply]
    # getReplyById(id: ID!): Reply
  }

  type Mutation {
    # createReply(reply: Reply!): Reply
    # deleteReply(reply: Reply!): Reply
  }

  type Reply {
    id: ID!
    body: String
    authorId: String
  }
`;

const resolvers = {
  Query: {
    getAllRepliesByPostId: async (_, { postId }) => {
      // return Reply.findAll({ where: { postId } });
      return await ReplyService.getAllRepliesByPostId(postid);
    }

    // getReplyById: async(_, { id }) => {
    //   return Reply.findById(id);
    // },
  },
  Mutation: {
    // createReply: async (_, { reply }, { authenticatedUserInstance }) => {
    //   if (!authenticatedUserInstance) {
    //     throw new AuthenticationError('INVALID_USER');
    //   }
    //   return ReplyService.createReply(reply);
    // },

    // updateReply: async(_, { reply }, { authenticatedUserInstance }) => {
    //   if (!authenticatedUserInstance) {
    //     throw new AuthenticationError('INVALID_USER');
    //   }
    //   return ReplyService.updateReply(reply);
    // },

    // deleteReplyById: async(_, { id }, { authenticatedUserInstance }) => {
    //   if (!authenticatedUserInstance) {
    //     throw new AuthenticationError('INVALID_USER');
    //   }
    //   return ReplyService.deleteReplyById(id);
    // },
  },
  /** What is this Reply hash for? */
  Reply: {
    commenter(reply) {
      return reply.getUser();
    },
    parent(reply) {
      return reply.getReply();
    }
  }
};

module.exports = makeExecutableSchema({ typeDefs, resolvers });
