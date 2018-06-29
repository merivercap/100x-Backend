const casual = require('casual');
const _ = require('lodash');

const scheduler = require('node-schedule');
const batchUpdate = require('../services/db_update');

const db = require('./database_connection/tables');

db.sequelize.sync().then(() => {

  const j = scheduler.scheduleJob('*/30 * * * *', batchUpdate);
});

module.exports = db;
