const routes = require('koa-router');
const dao = require('../models/dao');
const users = require('./users');

routes.use('/100x/v1/users', users);

routes.post('/100x/v1/login', (req, res) => {
  // ensure email and password have been passed
  if (!req.body.email || !req.body.password) {
    let error = new Error('invalid input. missing required parameter(s)');
    return res.status(500).send({ user: false, error: error, userId: null });
  }
  // attempt to authenticate user
  dao.isValidPassword(req.body.email, req.body.password, (err, tok, userId) => {
    if (err) {
      console.log(err);
      res.status(500).send({ success: false, token: null, userId: userId, error: error });
    } else {
      res.status(200).send({ success: true, token: tok, userId: userId });
    }
  });
});

module.exports = routes;