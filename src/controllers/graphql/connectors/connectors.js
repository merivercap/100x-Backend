const db = require('../../../models/sequelize/index');

// create mock data with a seed, so we always get the same
db.sequelize.sync({force:true}).then(() => {
});

const Post = db.sequelize.models.post;

module.exports = Post;
