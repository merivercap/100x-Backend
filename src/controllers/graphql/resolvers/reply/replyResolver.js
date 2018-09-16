const db = require('../../connectors');
const Reply = db.sequelize.models.reply;
const ReplyService = require('../../../../services/replyService');

module.exports = {
  Query: {
    getAllPostReplies: async (_, { postId }) => {
      return await ReplyService.fetchAllPostReplies(postId);
    },
    returnAllReplies: async (_, args) => {
      return await Reply.findAll({ where: { isDeleted: false } });
    },
    replyCountById: async (_, args) => {
      return await Reply.count({ where: { postId: args.postId, isDeleted: false } });
    }
  },
  Mutation: {
    broadcastReply: async (_, { input }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        return new AuthenticationError('ERROR_CREATING_OR_EDITING_REPLY');
      }
      return await ReplyService.broadcastAndStoreReply(authenticatedUserInstance, { input });
    },
    deleteReply: async(_, { permLink }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        return new AuthenticationError('ERROR_DELETING_REPLY');
      }
      return await ReplyService.deleteReply({ permLink });
    },
    voteReply: async(_, { permLink, up }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        return new AuthenticationError('ERROR_VOTING_ON_REPLY');
      }
      return await ReplyService.voteReply({ authenticatedUserInstance, permLink, up });
    }
  },
  Reply: {
    commenter(reply) {
      return reply.getUser();
    },
    parent(reply) {
      return reply.getParent();
    },
    post(reply) {
      return reply.getPost();
    }
  }
};
