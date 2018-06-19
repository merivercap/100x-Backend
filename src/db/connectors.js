const casual = require('casual');
const _ = require('lodash');

const batchUpdate = require('../database_update/batch');

const db = require('../models/dao');

db.sequelize.sync().then(() => {
  batchUpdate();
});

module.exports = db;
