const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');
const createClient = require('lightrpc').createClient;

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

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const PostModel = db.define('post', {
  author: { type: Sequelize.STRING },
  permlink: { type: Sequelize.STRING },
  title: { type: Sequelize.STRING },
  body: { type: Sequelize.STRING },
  created: { type: Sequelize.DATE },
  net_votes: { type: Sequelize.INTEGER },
  children: { type: Sequelize.INTEGER },
  curator_payout_value: { type: Sequelize.FLOAT },
  trending: { type: Sequelize.INTEGER },
  hot: { type: Sequelize.INTEGER },
  post_type: { type: Sequelize.INTEGER },
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
      hot: casual.integer(from = 0, to = 10000),
      post_type: 0,
    }).then((post) => {
      _.times(3, () => {
        return post.createTag({
          name: taggings[Math.floor(Math.random()*taggings.length)],
        });
      })
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

const client = createClient(process.env.STEEMJS_URL || 'https://api.steemit.com');
client.sendAsync = (message, params) => {
  return new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  })
    .then(result => {
      return 'replies';
    });
}

module.exports = {
  Post,
  Tag,
  client,
}
