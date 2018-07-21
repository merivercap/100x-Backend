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
  }

  initializeSteemUser(accessToken) {
    return sc2.Initialize({
      app: 'hundredx.app',
      callbackURL: process.env.DEV_URL,
      accessToken,
    });
  }

  verifyTokenApiCall(accessToken) {
    let that=this;
    return this.initializeSteemUser(accessToken).me(function (err, res) {
      if (err) {
        throw err
      } else {
        that.username=res['user'];
        return that.findOrCreateUser(that.username);
      }
    });
  }

  findOrCreateUser(username) {
    return UserModel
      .findOrCreate({
        where: {name: this.username },
        defaults: { id: _.random(10000)}
      })
      .spread((user, created) => {
        return user;
    });
  }


}

module.exports = UserAuthentication
