const APP_ENV = process.env.APP_ENV || 'development';
const RDS_HOSTNAME = process.env.RDS_HOSTNAME || 'hundredx.cpbd1tldajoe.us-west-1.rds.amazonaws.com';
const RDS_USERNAME = process.env.RDS_USERNAME || 'hundredx';
const RDS_PASSWORD = process.env.RDS_PASSWORD || 's6Um9NudsYr3rXRi6eBb';
const RDS_PORT = process.env.RDS_PORT || '3306';
const RDS_DB_NAME = process.env.RDS_DB_NAME || 'hundredx';

module.exports.APP_ENV = APP_ENV;
module.exports.RDS_HOSTNAME = RDS_HOSTNAME;
module.exports.RDS_USERNAME = RDS_USERNAME;
module.exports.RDS_PASSWORD = RDS_PASSWORD;
module.exports.RDS_PORT = RDS_PORT;
module.exports.RDS_DB_NAME = RDS_DB_NAME;
