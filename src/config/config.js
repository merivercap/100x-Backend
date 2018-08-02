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

const {
  SERVER_PORT
} = require('./apollo');

const env = process.env.APP_ENV || 'development';

const config = {
  test: {
    connection: { name: RDS_DB_NAME, username: 'root', password: 'root' },
    sequelizeOpts: { dialect: 'sqlite', storage: ':memory:', operatorsAliases: false },
    server: { port: SERVER_PORT },
  },
  development: {
    connection: { name: RDS_DB_NAME, username: RDS_USERNAME, password: RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: RDS_HOSTNAME, port: RDS_PORT, operatorsAliases: false, maxConcurrentQueries: 100, pool: { maxConnections: 5, maxIdleTime: 30, idle: 20000, acquire: 20000}, language: 'en'},
    server: { port: SERVER_PORT }
  },
  staging: {
    connection: { name: RDS_DB_NAME, username: RDS_USERNAME, password: RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: RDS_HOSTNAME, port: RDS_PORT, operatorsAliases: false },
    server: { port: SERVER_PORT },
  },
  production: {
    connection: { name: RDS_DB_NAME, username: RDS_USERNAME, password: RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: RDS_HOSTNAME, port: RDS_PORT, operatorsAliases: false },
    server: { port: SERVER_PORT },
  },
};

module.exports = config[env];
