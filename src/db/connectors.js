const casual = require('casual');
const _ = require('lodash');

const batchUpdate = require('../services/dbUpdate');

const db = require('../models/sequelize/index');

db.sequelize.sync().then(() => {
  batchUpdate();
});

module.exports = db;
