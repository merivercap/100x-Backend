const winston = require('winston');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ]
});

logger.on('error', error => {
  console.error(error);
});

logger.level = 'info';
module.exports = logger;
