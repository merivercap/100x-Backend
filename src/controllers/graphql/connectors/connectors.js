const reCalibrateHotAndTrendingPosts = require('../../../services/reCalibrateHotAndTrendingPosts');
const scheduler = require('node-schedule');

const db = require('../../../models/sequelize/index');

db.sequelize.sync({force:true}).then(() => {
  const j = scheduler.scheduleJob('*/30 * * * *', reCalibrateHotAndTrendingPosts);
});

const Post = db.sequelize.models.post;
module.exports = Post;
