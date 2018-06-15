const rdsConfig = require('../config/rds');

const db = new Sequelize(rdsConfig.RDS_DB_NAME, rdsConfig.RDS_USERNAME, rdsConfig.RDS_PASSWORD, {
  host: rdsConfig.RDS_HOSTNAME,
  port: rdsConfig.RDS_PORT,
  logging: console.log,
  maxConcurrentQueries: 100,
  dialect: 'mysql',
  pool: { maxConnections: 5, maxIdleTime: 30 },
  language: 'en'
});

module.exports = db;