const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');

const RDS_HOSTNAME = process.env.RDS_HOSTNAME || '';
const RDS_USERNAME = process.env.RDS_USERNAME || '';
const RDS_PASSWORD = process.env.RDS_PASSWORD || '';
const RDS_PORT = process.env.RDS_PORT || '3306';
const RDS_DB_NAME = process.env.RDS_DB_NAME || '';

const { batchUpdate } = require('../database_update/batch');



const db = new Sequelize(RDS_DB_NAME, RDS_USERNAME, RDS_PASSWORD, {
   host: RDS_HOSTNAME,
   port: RDS_PORT,
   logging: console.log,
   maxConcurrentQueries: 100,
   dialect: 'mysql',
   pool: { maxConnections: 5, maxIdleTime: 30},
   language: 'en'
})

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


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

const TagModel = db.define('tag', {
  name: { type: Sequelize.STRING, allowNull: false },
});

PostModel.hasMany(TagModel);
TagModel.belongsTo(PostModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
const numMinutes = 60;
db.sync().then(() => { // db.sync({force: true}) will drop all tables, effectively clearing the database...
  batchUpdate({ PostModel})
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
  Tag,
}
