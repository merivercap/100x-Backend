const createClient = require('lightrpc').createClient;

const client = createClient(process.env.STEEMJS_URL || 'https://api.steemit.com');
client.sendAsync = (message, params, cb, { PostModel }) => {
  return new Promise((resolve, reject) => {
    client.send(message, params, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  })
    .then(result => {
      return cb(result, { PostModel });
    });
}

module.exports = {
  client
};
