const db = require('../../connectors');
const Reply = db.sequelize.models.reply;

module.exports = {
  Query: {
  },
  Reply: {
    commenter(post) {
      return post.getReply();
    }
  }
};
