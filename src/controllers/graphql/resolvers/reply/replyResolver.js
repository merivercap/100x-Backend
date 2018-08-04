const db = require('../../connectors');
const Reply = db.sequelize.models.reply;
const ReplyService = require('../../../../services/replyService');

module.exports = {
  Query: {
    getAllPostReplies: async (_, args) => {
      const fetchPostReplies = new ReplyService({
        postId: args.postId,
      });
      return await fetchPostReplies.fetchAllPostReplies();
    },
    returnAllReplies: async (_, args) => {
      return await Reply.findAll();
    },
    replyCountById: async (_, args) => {
      return await Reply.count( {where:{ postId: args.postId}} );
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
