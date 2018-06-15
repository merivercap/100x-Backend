/**
 * TODO: fill out empty strings with default values
 * ie:
 * const RDS_HOSTNAME = process.env.RDS_HOSTNAME || 'hundredx-development.clxvjpl1kfc.us-west-2.rds.amazonaws.com';
 */
const RDS_HOSTNAME = process.env.RDS_HOSTNAME || '';
const RDS_USERNAME = process.env.RDS_USERNAME || '';
const RDS_PASSWORD = process.env.RDS_PASSWORD || '';
const RDS_PORT = process.env.RDS_PORT || '3306';
const RDS_DB_NAME = process.env.RDS_DB_NAME || '';

module.exports.RDS_HOSTNAME = RDS_HOSTNAME;
module.exports.RDS_USERNAME = RDS_USERNAME;
module.exports.RDS_PASSWORD = RDS_PASSWORD;
module.exports.RDS_PORT = RDS_PORT;
module.exports.RDS_DB_NAME = RDS_DB_NAME;




