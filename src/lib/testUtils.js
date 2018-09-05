const _ = require('lodash');
const sequelize = require('../models/sequelize/index').sequelize;

module.exports = {
  initializeDatabase: () => {
    return sequelize.sync({ force: true });
  },

  clearDatabase: () => {
    return true;//sequelize.dropAllTables();
  },

  createTestUserOpts: (number = 0) => {
    const randomNum = _.random(10000) + number;
    const id = `name${randomNum}`;

    return {
      id,
      name: id,
    };
  },

  createTestReplyOpts: (number = 0) => {
    const randomNum = _.random(10000) + number;
    const body = `
      We have a relational database working behind, so do its principles apply also for Sequelize which is a ORM for relational databases. The easiest would be to create another table or entity and associate them as a 1:n relationship. For that matter add a new model in Sequelize and define its associations like described here: http://sequelizejs.com/articles/getting-started#associations You might have then 2 tables. One profile table having N pictures.
    `;

    return {
      id: randomNum,
      permLink: `${randomNum}-re-kingscrown-get-byteballs-free-and-help-someone-you-follow-or-like-to-make-money-too-20180719t171429006z`,
      body,
      netVotes: 1,
      pendingPayoutValue: 33.33,
      children: 0,
      depth: 1,
    }
  },

  createTestPostOpts: (number = 0) => {
    const randomNum = _.random(10000) + number;
    const title = `Test post title ${randomNum}`;
    const body = `
      We have a relational database working behind, so do its principles apply also for Sequelize which is a ORM for relational databases. The easiest would be to create another table or entity and associate them as a 1:n relationship. For that matter add a new model in Sequelize and define its associations like described here: http://sequelizejs.com/articles/getting-started#associations You might have then 2 tables. One profile table having N pictures.
    `;

    return {
      id: randomNum,
      permLink: `${randomNum}first-post`,
      title,
      body,
      netVotes: 1,
      children: 1,
      pendingPayoutValue: 33.33,
      trending: 1,
      hot: 1,
      postType: 'post',
      tag1: 'tag'
    };
  },
}
