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
  tag1: { type: Sequelize.STRING },
  tag2: { type: Sequelize.STRING },
  tag3: { type: Sequelize.STRING },
  tag4: { type: Sequelize.STRING },
  tag5: { type: Sequelize.STRING }
});

db.sync().then(() => { // db.sync({force: true}) will drop all tables, effectively clearing the database...
  batchUpdate({ PostModel});
});

const Post = db.models.post;

module.exports = {
  Post,
}
