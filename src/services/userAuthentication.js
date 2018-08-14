'user strict';
// https://github.com/steemit/steemconnect-sdk
const sc2 = require('sc2-sdk');
const db         = require('../models/sequelize');
const models     = db.sequelize.models;
const UserModel  = models.user;
const _            = require('lodash');
const PostService = require('./postService');
const client       = require('./steem');

const { GET_FOLLOWING } = require('../utils/constants');

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
        throw new Error(`Invalid Access Token: ${err}`);
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

  getMyFollowersPosts() {
    const getFollowerPostsFromOurDb = (followingObjects) => {
      const authorUsernames = [];
      for (const followingObject of followingObjects[0]) { // replies returned in 2-D array.  Our client.sendAsync supports multiple requests..
        authorUsernames.push(followingObject.following);
      }
      return PostService.getPostsOfAuthors(authorUsernames);
    }
    // const params = [account (string)	start (string)	type (string)	limit (int)];
    const params = [[this.username,null,"blog",10]];
    return client.sendAsync(GET_FOLLOWING, params, getFollowerPostsFromOurDb);
  }

}

module.exports = UserAuthentication;
