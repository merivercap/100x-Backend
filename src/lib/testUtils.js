const _ = require('lodash');
const sequelize = require('../models/sequelize/index').sequelize;

module.exports = {
  initializeDatabase: () => {
    return sequelize.sync({ force: true });
  },

  clearDatabase: () => {
    return true;//sequelize.dropAllTables();
  },

  createTestUserOpts: () => {
    const randomNum = _.random(10000);
    const name = `name${randomNum}`;

    return {
      id: randomNum,
      name
    };
  },

  createTestReplyOpts: () => {
    const randomNum = _.random(10000);
    const body = `
      We have a relational database working behind, so do its principles apply also for Sequelize which is a ORM for relational databases. The easiest would be to create another table or entity and associate them as a 1:n relationship. For that matter add a new model in Sequelize and define its associations like described here: http://sequelizejs.com/articles/getting-started#associations You might have then 2 tables. One profile table having N pictures.
    `;
    
    return {
      id: randomNum,
      permLink: 're-kingscrown-get-byteballs-free-and-help-someone-you-follow-or-like-to-make-money-too-20180719t171429006z',
      body,
      netVotes: 1,
      pendingPayoutValue: 33.33,
    }
  },

  createTestPostOpts: () => {
    const randomNum = _.random(10000);
    const title = `Test post title ${randomNum}`;
    const body = `
      We have a relational database working behind, so do its principles apply also for Sequelize which is a ORM for relational databases. The easiest would be to create another table or entity and associate them as a 1:n relationship. For that matter add a new model in Sequelize and define its associations like described here: http://sequelizejs.com/articles/getting-started#associations You might have then 2 tables. One profile table having N pictures.
    `;

    return {
      id: randomNum,
      permLink: 'first-post',
      title,
      body,
      netVotes: 1,
      children: 1,
      pendingPayoutValue: 33.33,
      trending: 1,
      hot: 1,
      postType: 2,
      tag1: 'tag'
    };
  },
}
