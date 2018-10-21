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
    broadcastReply: async (_, { postPermLink, postAuthor, body }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await ReplyService.broadcastAndStoreReply(authenticatedUserInstance, postPermLink, postAuthor, body);
    },
    deleteReply: async(_, { permLink }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
      }
      return await ReplyService.deleteReply({ permLink });
    },
    voteReply: async(_, { permLink, up }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        throw new AuthenticationError('UNAUTHORIZED_USER');
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
