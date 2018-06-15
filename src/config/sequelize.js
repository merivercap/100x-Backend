/**
 * This file sets config for multiple environments:
 * Test - Test environment for features in testing
 * Development - Dev env, for features in progress
 * Staging - for features ready to be pushed to production
 * Production - production env. live
 */
const rdsConfig = require('./rds');

const env = process.env.APP_ENV || 'development';

const settings = {
  test: {
    connection: { name: 'dhundredx', username: 'root', password: 'root' },
    sequelizeOpts: { dialect: 'sqlite', storage: ':memory:', operatorsAliases: false }
  },
  development: {
    connection: { name: rdsConfig.RDS_DB_NAME, username: rdsConfig.RDS_USERNAME, password: rdsConfig.RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: rdsConfig.RDS_HOSTNAME, port: rdsConfig.RDS_PORT, operatorsAliases: false }
  },
  staging: {
    connection: { name: rdsConfig.RDS_DB_NAME, username: rdsConfig.RDS_USERNAME, password: rdsConfig.RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: rdsConfig.RDS_HOSTNAME, port: rdsConfig.RDS_PORT, operatorsAliases: false }
  },
  production: {
    connection: { name: rdsConfig.RDS_DB_NAME, username: rdsConfig.RDS_USERNAME, password: rdsConfig.RDS_PASSWORD },
    sequelizeOpts: { dialect: 'mysql', host: rdsConfig.RDS_HOSTNAME, port: rdsConfig.RDS_PORT, operatorsAliases: false }
  },
};

module.exports = settings[env];
