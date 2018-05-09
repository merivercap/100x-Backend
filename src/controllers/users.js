const users = require('koa-router');
const dao = require('../../models/dao');

// CREATE
users.post("/", (req, res) => {
  let userData = {};
  // Ensure all required fields are present
  if (!req.body.email || !req.body.firstName || !req.body.lastName || !req.body.password) {
    let error = new Error('invalid input. missing required parameter(s).');
    return res.status(500).send({ user: false, error: error, userId: null });
  }

  // TODO: validate body parameters
  userData.email = req.body.email;
  userData.firstName = req.body.firstName;
  userData.lastName = req.body.lastName;
  userData.password = req.body.password;

  // register new user and store user into rds
  dao.registerNewUser(userData)
    .then(user => {
      // respond with success
      return res.status(200).send({ user: true, error: null, uuid: user.uuid });
    })
    .catch(error => {
      if (error.code === 'UsernameExistsException') {
        return res.status(409).send({ user: false, error: error, uuid: null });
      }
      // respond with error
      return res.status(500).send({ user: false, error: error, uuid: null });
    });
});

// READ/GET/FETCH
users.get("/", (req, res) => {
  if (!res.locals.user) {
    return res.status(500).send("user not found");
  }

  let user = {
    firstName: res.locals.user.firstName,
    lastName: res.locals.user.lastName,
    profilePicUrl: res.locals.user.profilePicUrl,
    email: res.locals.user.email,
  };

  return res.status(200).send(user);
})

// DELETE
users.delete("/:id", (req, res) => {
  res.status(200).send("deleteUser: " + req.params.id);
});

module.exports = users;