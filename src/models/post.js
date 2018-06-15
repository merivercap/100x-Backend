const Sequelize = require('sequelize');
const db = require('../data/db');

/**
 * We should make this model into a class and store functions responsible for 
 * talking to the db in here
 */

const PostModel = db.define('post', {
  author: { type: Sequelize.STRING, allowNull: false, unique: 'compositeIndex' },
  permlink: { type: Sequelize.STRING, allowNull: false, unique: 'compositeIndex' },
  title: { type: Sequelize.STRING, allowNull: false },
  body: { type: Sequelize.STRING, allowNull: false },
  created: { type: Sequelize.DATE, allowNull: false },
  net_votes: { type: Sequelize.INTEGER, allowNull: false },
  children: { type: Sequelize.INTEGER, allowNull: false },
  curator_payout_value: { type: Sequelize.FLOAT, allowNull: false },
  trending: { type: Sequelize.INTEGER },
  hot: { type: Sequelize.INTEGER },
  post_type: { type: Sequelize.INTEGER, allowNull: false },
});

module.exports.PostModel = PostModel;
