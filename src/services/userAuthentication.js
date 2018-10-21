// https://github.com/steemit/steemconnect-sdk
const sc2 = require('sc2-sdk');
const db = require('../models/sequelize');
const models = db.sequelize.models;
const UserModel = models.user;
const _ = require('lodash');
const PostService = require('./postService');
const client = require('./steem');
const idGenerator = require('./idGenerator');

const { GET_FOLLOWING } = require('../utils/constants');

class UserAuthentication {
  constructor() {
    this.username;
    this.steemUser;
    this.userInOurDb;
  }

  verifyTokenApiCall(accessToken) {
    let self = this;
    return this.initializeSteemUser(accessToken).me(function (err, res) {
      if (err) throw err;
      self.username = res['user'];
      return self.userInOurDb = self.findOrCreateUser(self.username);
    });
  }
  followSteemUser(steemUserNameToFollow) {
    const self = this;
    return this.steemUser.follow(
      this.username,
      steemUserNameToFollow,
      function(err, res) {
        if (err) throw err;
        return self.userInOurDb;
      }
    );
  }

  unFollowSteemUser(steemUserNameToUnfollow) {
    const self = this;
    return this.steemUser.unfollow(
      this.username,
      steemUserNameToUnfollow,
      function(err, res) {
        if (err) throw err;
        return self.userInOurDb;
      }
    );
  }

  claimUsersRewardBalance() {
    const self = this;
    return this.steemUser.claimRewardBalance(
      self.username,
      self.userInOurDb.steemBalance,
      self.userInOurDb.sbdBalance,
      self.userInOurDb.vestingBalance,
      function(err, res) {
        if (err) throw err;
        return self.userInOurDb;
      }
    );
  }

  findOrCreateUser(username) {
    return UserModel
      .findOrCreate({
        where: { name: username },
        defaults: { id: username + idGenerator.generate() }
      })
      .spread((user, created) => {
        return user;
    });
  }

  initializeSteemUser(accessToken) {
    return this.steemUser = sc2.Initialize({
      baseURL: 'https://steemconnect.com',
      app: 'hundredx.app',
      callbackURL: process.env.DEV_URL,
      accessToken,
    });
  }

  getMyFollowersPostsAndUsersAuthoredPosts() {
    const getFollowerPostsFromOurDb = (followingObjects) => {
      const authorUsernames = [];
      for (const followingObject of followingObjects[0]) { // replies returned in 2-D array.  Our client.sendAsync supports multiple requests..
        authorUsernames.push(followingObject.following);
      }
      authorUsernames.push(this.username);
      return PostService.getPostsOfAuthors(authorUsernames);
    }
    // const params = [account (string)	start (string)	type (string)	limit (int)];
    const params = [[this.username,null,"blog",10]];
    return client.sendAsync(GET_FOLLOWING, params, getFollowerPostsFromOurDb);
  }

  broadcastPost({ permLink, title, body, tags }) { // create or edit
    return this.steemUser.comment(
      '',
      '',
      this.username,
      permLink,
      title,
      body,
      { "tags": tags },
      function (err, res) {
        if (err) throw err;
        return true; // Why not return res?
      }
    );
  }

  vote({ permlink, author, weight }) {
    return this.steemUser.vote(
      this.username,
      author,
      permlink,
      weight,
      function(err, res) {
        if (err) throw err;
        return true; // Why not return res?
      });
  }

  broadcastReply({ postAuthor, postPermLink, permLink, body }) { // create or edit
    return this.steemUser.comment(
      postAuthor,
      postPermLink,
      this.username,
      permLink,
      '',
      body,
      {},
      function (err, res) {
        if (err) throw err;
        return true; // Why not return res?
      }
    );
  }
}

module.exports = UserAuthentication;
