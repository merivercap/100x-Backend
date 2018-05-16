// const AWSXRay = require('./../services/tracer');
// const mysql = AWSXRay.captureMySQL(require('mysql'));
const mysql = require('mysql');
const path = require('path');

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

module.exports.pool = pool;
