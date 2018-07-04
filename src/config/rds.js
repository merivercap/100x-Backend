const APP_ENV = process.env.APP_NAME || 'development';
const RDS_HOSTNAME = process.env.RDS_HOSTNAME || 'hundredx-free-tier.c5y8ef2hylq6.us-west-1.rds.amazonaws.com';
const RDS_USERNAME = process.env.RDS_USERNAME || 'hundredx';
const RDS_PASSWORD = process.env.RDS_PASSWORD || 'vkobi9Zc7aChgd6sfCYn65F8QVEqn6DS';
const RDS_PORT = process.env.RDS_PORT || '3306';
const RDS_DB_NAME = process.env.RDS_DB_NAME || 'hundredx_dev';

module.exports.APP_ENV = APP_ENV;
module.exports.RDS_HOSTNAME = RDS_HOSTNAME;
module.exports.RDS_USERNAME = RDS_USERNAME;
module.exports.RDS_PASSWORD = RDS_PASSWORD;
module.exports.RDS_PORT = RDS_PORT;
module.exports.RDS_DB_NAME = RDS_DB_NAME;
