/**
 * This file sets config for multiple environments:
 * Test - Test environment for features in testing
 * Development - Dev env, for features in progress
 * Staging - for features ready to be pushed to production
 * Production - production env. live
 */
const {
  HUNDREDX_APP_ENV,
  HUNDREDX_RDS_HOSTNAME,
  HUNDREDX_RDS_USERNAME,
  HUNDREDX_RDS_PASSWORD,
  HUNDREDX_RDS_PORT,
  HUNDREDX_RDS_DB_NAME,
} = require('./rds');

const {
  SERVER_PORT
} = require('./apollo');

const env = process.env.HUNDREDX_APP_ENV || 'development';

const config = {
  test: {
    connection: { name: HUNDREDX_RDS_DB_NAME, username: 'root', password: 'root' },
    sequelizeOpts: { dialect: 'sqlite', storage: ':memory:', operatorsAliases: false }
  },
  development: {
    connection: { name: HUNDREDX_RDS_DB_NAME, username: HUNDREDX_RDS_USERNAME, password: HUNDREDX_RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: HUNDREDX_RDS_HOSTNAME, port: HUNDREDX_RDS_PORT, operatorsAliases: false, maxConcurrentQueries: 100, pool: { maxConnections: 5, maxIdleTime: 30}, language: 'en'}
  },
  staging: {
    connection: { name: HUNDREDX_RDS_DB_NAME, username: HUNDREDX_RDS_USERNAME, password: HUNDREDX_RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: HUNDREDX_RDS_HOSTNAME, port: HUNDREDX_RDS_PORT, operatorsAliases: false }
  },
  production: {
    connection: { name: HUNDREDX_RDS_DB_NAME, username: HUNDREDX_RDS_USERNAME, password: HUNDREDX_RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: HUNDREDX_RDS_HOSTNAME, port: HUNDREDX_RDS_PORT, operatorsAliases: false }
  },
};

module.exports = config[env];
