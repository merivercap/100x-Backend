'user strict';

// https://github.com/steemit/steemconnect-sdk

const sc2 = require('sc2-sdk');
const db         = require('../models/sequelize');
const models     = db.sequelize.models;
const UserModel  = models.user;
const _            = require('lodash');

class UserAuthentication {
  constructor() {
    this.username;
    this.steemUser;
    this.userInOurDb;
  }

  verifyTokenApiCall(accessToken) {
    let that=this;
    return this.initializeSteemUser(accessToken).me(function (err, res) {
      if (err) {
        throw err
      } else {
        that.username=res['user'];
        return that.userInOurDb = that.findOrCreateUser(that.username);
      }
    });
  }
  followSteemUser(steemUserNameToFollow) {
    let that=this;
    return this.steemUser.follow(
      this.username,
      steemUserNameToFollow,
      function(err, res) {
        console.log(err);
        return err
          ? new Error(err.error_description)
          : that.userInOurDb;
      }
    );
  }

  unFollowSteemUser(steemUserNameToUnfollow) {
    return this.steemUser.unfollow(
      this.username,
      steemUserNameToUnfollow,
      function(err, res) {
        return err
          ? new Error(err.error_description)
          : that.userInOurDb;
      }
    );
  }

  findOrCreateUser(username) {
    return UserModel
      .findOrCreate({
        where: {name: username },
        defaults: { id: _.random(10000)}
      })
      .spread((user, created) => {
        return user;
    });
  }

  initializeSteemUser(accessToken) {
    return this.steemUser = sc2.Initialize({
      app: 'hundredx.app',
      callbackURL: process.env.DEV_URL,
      accessToken,
    });
  }

}

module.exports = UserAuthentication
