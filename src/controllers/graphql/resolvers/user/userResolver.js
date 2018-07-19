const db = require('../../connectors');

const User = db.sequelize.models.user;

module.exports = {
  Query: {
    user(_, args) {
      return User.find({ where: args });
    }
  },
  User: {
    posts(author) {
      return author.getPosts();
    }
    replies(commenter) {
      return commenter.getReplies();
    }
  }
};
