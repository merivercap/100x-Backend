/**
 * This file sets config for multiple environments:
 * Test - Test environment for features in testing
 * Development - Dev env, for features in progress
 * Staging - for features ready to be pushed to production
 * Production - production env. live
 */
const {
  APP_ENV,
  RDS_HOSTNAME,
  RDS_USERNAME,
  RDS_PASSWORD,
  RDS_PORT,
  RDS_DB_NAME,
} = require('./rds');


const env = process.env.APP_ENV || 'development';

const config = {
  test: {
    connection: { name: RDS_DB_NAME, username: 'root', password: 'root' },
    sequelizeOpts: { dialect: 'sqlite', storage: ':memory:', operatorsAliases: false }
  },
  development: {
    connection: { name: RDS_DB_NAME, username: RDS_USERNAME, password: RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: RDS_HOSTNAME, port: RDS_PORT, operatorsAliases: false, maxConcurrentQueries: 100, pool: { maxConnections: 5, maxIdleTime: 30}, language: 'en'}
  },
  staging: {
    connection: { name: RDS_DB_NAME, username: RDS_USERNAME, password: RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: RDS_HOSTNAME, port: RDS_PORT, operatorsAliases: false }
  },
  production: {
    connection: { name: RDS_DB_NAME, username: RDS_USERNAME, password: RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: RDS_HOSTNAME, port: RDS_PORT, operatorsAliases: false }
  },
};

module.exports = config[env];
