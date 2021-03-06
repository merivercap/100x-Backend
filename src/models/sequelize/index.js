const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const decamelizeKeys = require('decamelize-keys');
const logger = require('../../services/logger');
const config = require('../../config/config');
const basename  = path.basename(__filename);
const db = {};

config.sequelizeOpts.define = {
  hooks: {
    beforeValidate: (item, options) => {
      // store fields in DB as snake_case instead of camelCase
      if (item.meta && typeof(item.meta) === 'object') {
        item.meta = decamelizeKeys(item.meta, '_');
      }
    }
  }
};

const sequelize = new Sequelize(
   config.connection.name,
   config.connection.username,
   config.connection.password,
   config.sequelizeOpts
 );

db.User = sequelize.import('./User');
db.Post = sequelize.import('./Post');
db.Reply = sequelize.import('./Reply');

// model relationships...has many...belongs...
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
