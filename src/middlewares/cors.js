const allowedOrigins = new Set([
  'http://www.100xcrypto.net.s3-website-us-west-1.amazonaws.com',
  'https://www.100xcrypto.net',
  'http://api-100x-dev.us-west-1.elasticbeanstalk.com/graphql',
  'http://localhost:4000',
  'http://localhost:3000',
]);

module.exports = function(req, res, next) {
  let origin = req.headers.origin;
  // allow relaxed policy for local dev
  if (!origin) {
    return next();
  } else if (process.env.APP_ENV !== 'production' || process.env.APP_ENV !== 'staging' || allowedOrigins.has(origin)) {
    // set access control origin to be that of the requester
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // default origin
    res.header('Access-Control-Allow-Origin', 'http://www.100xcrypto.net.s3-website-us-west-1.amazonaws.com')
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin,  X-Requested-With, Content-Type, Accept, Authorization, accesstoken, cache-control');
  // return immediately on cors probe requests
  if (req.method === 'OPTIONS') {
    return res.status(200).send({});
  }

  next();
};
