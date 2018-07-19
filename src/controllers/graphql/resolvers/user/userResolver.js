const db = require('../../connectors');

const USer = db.sequelize.models.user;

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
  }
};
