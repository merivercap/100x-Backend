const HUNDREDX_APP_ENV = process.env.HUNDREDX_APP_ENV || 'development';
const HUNDREDX_RDS_HOSTNAME = process.env.HUNDREDX_RDS_HOSTNAME || 'hundredx-dev3.ccufiluhcjan.us-west-1.rds.amazonaws.com';
const HUNDREDX_RDS_USERNAME = process.env.HUNDREDX_RDS_USERNAME || 'hundredx';
const HUNDREDX_RDS_PASSWORD = process.env.HUNDREDX_RDS_PASSWORD || 's6Um9NudsYr3rXRi6eBb';
const HUNDREDX_RDS_PORT = process.env.HUNDREDX_RDS_PORT || '3306';
const HUNDREDX_RDS_DB_NAME = process.env.HUNDREDX_RDS_DB_NAME || 'hundredx_dev3';

module.exports.HUNDREDX_APP_ENV = HUNDREDX_APP_ENV;
module.exports.HUNDREDX_RDS_HOSTNAME = HUNDREDX_RDS_HOSTNAME;
module.exports.HUNDREDX_RDS_USERNAME = HUNDREDX_RDS_USERNAME;
module.exports.HUNDREDX_RDS_PASSWORD = HUNDREDX_RDS_PASSWORD;
module.exports.HUNDREDX_RDS_PORT = HUNDREDX_RDS_PORT;
module.exports.HUNDREDX_RDS_DB_NAME = HUNDREDX_RDS_DB_NAME;
