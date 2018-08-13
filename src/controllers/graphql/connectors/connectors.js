const reCalibrateHotAndTrendingPosts = require('../../../services/reCalibrateHotAndTrendingPosts');
const scheduler = require('node-schedule');

const db = require('../../../models/sequelize/index');

db.sequelize.sync({force: true}).then(() => {
  reCalibrateHotAndTrendingPosts();
  // const j = scheduler.scheduleJob('*/30 * * * *', reCalibrateHotAndTrendingPosts);
});

module.exports = db;
