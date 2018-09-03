const db = require('../../connectors');
const Reply = db.sequelize.models.reply;
const replyService = require('../../../../services/replyService');

module.exports = {
  Query: {
    getAllPostReplies: async (_, args) => {
      return await replyService.fetchAllPostReplies(args.postId);
    },
    returnAllReplies: async (_, args) => {
      return await Reply.findAll();
    },
    replyCountById: async (_, args) => {
      return await Reply.count({ where: { postId: args.postId } });
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
