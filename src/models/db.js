const AWSXRay = require('./../services/tracer');
const mysql = AWSXRay.captureMySQL(require('mysql'));

// TODO: hook up with Amazon RDS
const RDS_HOSTNAME = process.env.RDS_HOSTNAME || '';
const RDS_USERNAME = process.env.RDS_USERNAME || '';
const RDS_PASSWORD = process.env.RDS_PASSWORD || '';
const RDS_PORT = process.env.RDS_PORT || '3306';
const RDS_DB_NAME = process.env.RDS_DB_NAME || '';

var pool = mysql.createPool({
  host:     RDS_HOSTNAME,
  user:     RDS_USERNAME,
  password: RDS_PASSWORD,
  port:     RDS_PORT,
  database: RDS_DB_NAME,
});

console.log(`Connected to ${RDS_HOSTNAME}`);

module.exports = pool;
module.exports.format = mysql.format;