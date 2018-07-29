const db = require('../../connectors');
const Reply = db.sequelize.models.reply;

module.exports = {
  Query: {
    getAllPostReplies: async (_, args) => {
      return Reply.findAll({ where: { postId: args.postId } });
    },
  },
  Reply: {
    commenter(reply) {
      return reply.getUser();
    },
    parent(reply) {
      return reply.getReply();
    }
  }
};
