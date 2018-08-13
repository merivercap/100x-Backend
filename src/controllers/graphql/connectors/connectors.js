const reCalibrateHotAndTrendingPosts = require('../../../services/reCalibrateHotAndTrendingPosts');
const scheduler = require('node-schedule');

const db = require('../../../models/sequelize/index');

<<<<<<< HEAD
db.sequelize.sync({force: true}).then(() => {
  reCalibrateHotAndTrendingPosts();
  // const j = scheduler.scheduleJob('*/30 * * * *', reCalibrateHotAndTrendingPosts);
=======
db.sequelize.sync({force:true}).then(() => {
  const j = scheduler.scheduleJob('*/30 * * * *', reCalibrateHotAndTrendingPosts);
>>>>>>> master
});

module.exports = db;
