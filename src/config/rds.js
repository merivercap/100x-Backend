const APP_ENV = process.env.APP_ENV || 'development';
const RDS_HOSTNAME = process.env.RDS_HOSTNAME || 'rds-dev2.ccufiluhcjan.us-west-1.rds.amazonaws.com';
const RDS_USERNAME = process.env.RDS_USERNAME || 'hundredx';
const RDS_PASSWORD = process.env.RDS_PASSWORD || 'Hvu7797JWXqidrEFYc3LSanAWS2eXQC5';
const RDS_PORT = process.env.RDS_PORT || '3306';
const RDS_DB_NAME = process.env.RDS_DB_NAME || 'rds_dev2';

module.exports.APP_ENV = APP_ENV;
module.exports.RDS_HOSTNAME = RDS_HOSTNAME;
module.exports.RDS_USERNAME = RDS_USERNAME;
module.exports.RDS_PASSWORD = RDS_PASSWORD;
module.exports.RDS_PORT = RDS_PORT;
module.exports.RDS_DB_NAME = RDS_DB_NAME;
