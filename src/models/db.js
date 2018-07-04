const logger = require('./../services/logger');
const AWSXRay = require('./../services/tracer');
const mysql = AWSXRay.captureMYSql(require('mysql'));

const {
  APP_ENV,
  RDS_HOSTNAME,
  RDS_USERNAME,
  RDS_PASSWORD,
  RDS_PORT,
  RDS_DB_NAME,
} = require('../config/rds');

var pool = mysql.createPool({
  host: RDS_HOSTNAME,
  user: RDS_USERNAME,
  password: RDS_PASSWORD,
  port: RDS_PORT,
  database: RDS_DB_NAME,
});

logger.info(`DB connected to ${RDS_HOSTNAME}`);

module.exports = pool;
module.export.format = mysql.format;