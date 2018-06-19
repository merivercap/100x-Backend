const createClient = require('lightrpc').createClient;

const client = createClient(process.env.STEEMJS_URL || 'https://api.steemit.com');
client.sendAsync = (message, params, cb, PostModel = '') => {
  const post = PostModel.PostModel || null;
  const allPromises = params.map((param) => {
    return new Promise((resolve, reject) => {
      client.send(message, param, (err, result) => {
        if (err !== null) return reject(err);
        resolve(result);
      });
    })
  })

  const handleResult = (result) => {
    console.log(result[0].replies);
    return cb(result, { PostModel: post });
  }

  Promise.all(allPromises).then(handleResult).catch(err => console.log(err));
}

module.exports = client;
