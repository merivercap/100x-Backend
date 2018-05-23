const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');

const RDS_HOSTNAME = process.env.RDS_HOSTNAME || '';
const RDS_USERNAME = process.env.RDS_USERNAME || '';
const RDS_PASSWORD = process.env.RDS_PASSWORD || '';
const RDS_PORT = process.env.RDS_PORT || '3306';
const RDS_DB_NAME = process.env.RDS_DB_NAME || '';



const db = new Sequelize(RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD, {
   host: RDS_HOSTNAME,
   port: RDS_PORT,
   logging: console.log,
   maxConcurrentQueries: 100,
   dialect: 'mysql',
   pool: { maxConnections: 5, maxIdleTime: 30},
   language: 'en'
})


const PostModel = db.define('post', {
  author: { type: Sequelize.STRING },
  permlink: { type: Sequelize.STRING },
  title: { type: Sequelize.STRING },
  body: { type: Sequelize.STRING },
  created: { type: Sequelize.STRING },
  net_votes: { type: Sequelize.STRING },
  children: { type: Sequelize.STRING },
  curator_payout_value: { type: Sequelize.STRING },
  trending: { type: Sequelize.STRING },
  post_type: { type: Sequelize.STRING },
});

const TagModel = db.define('tag', {
  name: { type: Sequelize.STRING },
});

PostModel.hasMany(TagModel);
TagModel.belongsTo(PostModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({ force: true }).then(() => {
  _.times(10, () => {
    return PostModel.create({
      firstName: casual.first_name,
      lastName: casual.last_name,
      author: casual.username,
      permlink: casual.word,
      title: casual.title,
      body: casual.sentences(n = 3),
      created: casual.unix_time,
      net_votes: casual.integer(from = 0, to = 1000),
      children: casual.integer(from = 0, to = 1000),
      curator_payout_value: casual.integer(from = 0, to = 1000),
      trending: casual.integer(from = 0, to = 10000),
      post_type: casual.integer(from = 0, to = 2),
    }).then((post) => {
      return post.createTag({
        name: taggings[Math.floor(Math.random()*taggings.length)],
      });
    });
  });
});

const taggings = [
  'bitcoin',
  'crypto',
  'cryptocurrency',
  'blockchain',
  'beyondbitcoin',
  'ethereum',
  'eos',
];

const Post = db.models.post;
const Tag = db.models.tag;

module.exports = {
  Post,
  Tag
}
