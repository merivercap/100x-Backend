const reCalibrateHotAndTrendingPosts = require('../../../services/reCalibrateHotAndTrendingPosts');
const scheduler = require('node-schedule');

const db = require('../../../models/sequelize');

db.sequelize.sync({force: false}).then(() => {
  reCalibrateHotAndTrendingPosts();
  // const j = scheduler.scheduleJob('*/30 * * * *', reCalibrateHotAndTrendingPosts);
});

module.exports = db;
