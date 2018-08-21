const db = require('../models/sequelize');
const models = db.sequelize.models;
const User = models.user;

class UserService {
  deleteUserById(id) {
    // something like steemApi.deleteUser(id) ?
  }

  follow({ authorizedUser, steemUserNameToFollow }) {
    authorizedUser.followSteemUser(steemUserNameToFollow);
  }

  getAllUsers() {
    return User.findAll();
  }

  getUserById(id) {
    return User.findById(id);
  }

  login({ username, password }) {
    // make call to steemApi to login user
  }

  updateUser(user) {
    // make call to steemApi to update user
  }
  
  unfollow({ authorizedUser, steemUserNameToUnfollow }) {
    authorizedUser.unfollowSteemUser(steemUserNameToUnfollow);
  }
}

module.exports = UserService;
