const casual = require('casual');
const _ = require('lodash');

const batchUpdate = require('../services/db_update');

const db = require('./database_connection/tables');

db.sequelize.sync().then(() => {
  batchUpdate();
});

module.exports = db;
