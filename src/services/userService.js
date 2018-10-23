const db           = require('../models/sequelize');
const _            = require('lodash');
const client       = require('./steem');
const {
  GET_ACCOUNTS,
  GET_DYNAMIC_GLOBAL_PROPERTIES,
}                  = require('../utils/constants');
const User         = db.sequelize.models.user;

module.exports = {
  mapSteemUserInfoToOurBackend: function(userInfoFromSteemit) {
    const jsonMetadata = JSON.parse(userInfoFromSteemit.json_metadata);
    const location = jsonMetadata.profile.location;
    const introBlurb = jsonMetadata.profile.about;
    const profileImageUrl = jsonMetadata.profile.profile_image;
    // const realLifeName = jsonMetadata.name;
    const reputationScore = userInfoFromSteemit.posting_rewards;
    const createdAt = userInfoFromSteemit.created;
    const votingPower = userInfoFromSteemit.voting_power;
    const realLifeName = jsonMetadata.profile.name;
    const sbdBalance = parseFloat(userInfoFromSteemit.sbd_balance);
    const steemBalance = parseFloat(userInfoFromSteemit.balance);
    const userVests = parseFloat(userInfoFromSteemit.vesting_shares);

    return {
      profileImageUrl,
      introBlurb,
      location,
      realLifeName,
      reputationScore,
      createdAt,
      votingPower,
      steemBalance,
      sbdBalance,
      userVests,
    };
  },

  getUserProfileInfo: async function(name) {
    return this.getUserAccount(name)
      .then(userInOurDb => {
        return this.getDynamicVestInfo(userInOurDb);
      })
      .then(userInOurDb => {
        return this.getCoinMarketCapPrices(userInOurDb);
      })
      .catch(err => {
        throw err;
      });
  },

  getCoinMarketCapPrices: async function(userRecord) {
    const url = "https://api.coinmarketcap.com/v1/ticker/steem";

    return await fetch(url)
      .then(function(data) {
          const steemPriceInUsd = parseFloat(data.price_usd);
          const steemTokensInAccount = userRecord.steemBalance + userRecord.steemPower
          const estimatedAccountValue = steemTokensInAccount * steemPriceInUsd + userRecord.sbdBalance;
          return userRecord.update({ estimatedAccountValue });
      })
      .catch(err => {
        throw err;
      });
  },

  getDynamicVestInfo: async function(userRecord) {
    const params = [[]];
    return client.sendAsync(GET_DYNAMIC_GLOBAL_PROPERTIES, params, calculateSteemPower(userRecord));
  },

  getUserAccount: async function(name) {
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
};


/** Helper functions */
function calculateSteemPower(userRecord) {
  return vestInfo => {
    const vestProperties = vestInfo[0];
    const totalSteem = parseFloat(vestProperties.total_vesting_fund_steem);
    const totalVests = parseFloat(vestProperties.total_vesting_shares);
    const userVests = userRecord.userVests;
    const steemPower = totalSteem * (userVests / totalVests);
    return userRecord.update({ steemPower });
  };
}
