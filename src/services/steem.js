const createClient = require('lightrpc').createClient;

const client = createClient(process.env.STEEMJS_URL || 'https://api.steemit.com');
client.sendAsync = (message, params, handleResult) => {
  const allPromises = params.map(param => (
    new Promise((resolve, reject) => {
      client.send(message, param, (err, result) => {
        if (err !== null) return reject(err);
        resolve(result);
      });
    })
  ));

  return Promise.all(allPromises).then(handleResult).catch(err => console.log(err));
}

module.exports = client;
