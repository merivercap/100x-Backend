const createClient = require('lightrpc').createClient;

const client = createClient(process.env.STEEMJS_URL || 'https://api.steemit.com');
client.sendAsync = (message, params, storePostsOrReplies) => {
  const allPromises = params.map(param => (
    new Promise((resolve, reject) => {
      client.send(message, param, (err, result) => {
        if (err !== null) return reject(err);
        resolve(result);
      });
    })
  ));

  const result = Promise.all(allPromises).then(storePostsOrReplies).catch(err => console.log(err));
  return result;
}

module.exports = client;
