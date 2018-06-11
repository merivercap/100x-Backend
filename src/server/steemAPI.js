const createClient = require('lightrpc').createClient;

const client = createClient(process.env.STEEMJS_URL || 'https://api.steemit.com');
client.sendAsync = (message, params, cb, { PostModel }) => {
  const allPromises = params.map((param) => {
    return new Promise((resolve, reject) => {
      client.send(message, param, (err, result) => {
        if (err !== null) return reject(err);
        resolve(result);
      });
    })
  })

  const handleResult = (result) => {
    return cb(result, { PostModel });
  }

  Promise.all(allPromises).then(handleResult);
}

module.exports = {
  client
};
