const db = require('../data/db');

const TagModel = db.define('tag', {
  name: { type: Sequelize.STRING, allowNull: false },
});

module.exports = TagModel;