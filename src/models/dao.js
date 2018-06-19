
var fs        = require('fs');
var path      = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config');
var basename  = path.basename(__filename);
var db        = {};

const sequelize = new Sequelize(
   config.connection.name,
   config.connection.username,
   config.connection.password,
   config.sequelizeOpts
 );

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    // import and create each model
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

// model relationships...has many...belongs...
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
