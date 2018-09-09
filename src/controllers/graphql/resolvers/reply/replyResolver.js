const db = require('../../connectors');
const Reply = db.sequelize.models.reply;
const ReplyService = require('../../../../services/replyService');

module.exports = {
  Query: {
    getAllPostReplies: async (_, { postId }) => {
      return await ReplyService.fetchAllPostReplies(postId);
    },
    returnAllReplies: async (_, args) => {
      return await Reply.findAll();
    },
    replyCountById: async (_, args) => {
      return await Reply.count( {where:{ postId: args.postId}} );
    }
  },
  Mutation: {
    broadcastReply: async (_, { postId, permLink, body }, { authenticatedUserInstance } ) => {
      if (!authenticatedUserInstance) {
        return new AuthenticationError('ERROR_CREATING_OR_EDITING_REPLY');
      }
      return await ReplyService.broadcastAndStoreReply({ authenticatedUserInstance, postId, permLink, body });
    },
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
