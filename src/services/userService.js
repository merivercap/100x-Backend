const db           = require('../models/sequelize');
const _            = require('lodash');
const client       = require('./steem');
const {
  GET_ACCOUNTS,
}                  = require('../utils/constants');
const User         = db.sequelize.models.user;

module.exports = {

  mapSteemUserInfoToOurBackend: function(userInfoFromSteemit) {
    const jsonMetadata = JSON.parse(userInfoFromSteemit.json_metadata);
    const location = jsonMetadata.profile.location;
    const introBlurb = jsonMetadata.profile.about;
    const profileImageUrl = jsonMetadata.profile.profile_image;
    const realLifeName = jsonMetadata.name;
    const reputationScore = userInfoFromSteemit.posting_rewards;
    const createdAt = userInfoFromSteemit.created;
    const votingPower = userInfoFromSteemit.voting_power;

    return {
      profileImageUrl,
      introBlurb,
      location,
      realLifeName,
      reputationScore,
      createdAt,
      votingPower
    };
  },

  getUserInfo: async function(name) {
    const storeUserInfo = (userInfo) => {
      const userProfileInformation = this.mapSteemUserInfoToOurBackend(userInfo[0][0]);
      return User.findOne({where: { name }})
        .then(user => {
          return user.update(userProfileInformation);
        })
        .then(updatedUser => {
          return updatedUser;
        })
        .catch (err => console.log(err));
    }

    const params = [[[name]]];
    return client.sendAsync(GET_ACCOUNTS, params, storeUserInfo);
  },
}
