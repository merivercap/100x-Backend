const db           = require('../models/sequelize');
const PostModel    = db.sequelize.models.post;
const UserModel    = db.sequelize.models.user;
const Op           = db.Sequelize.Op;
const _            = require('lodash');
const ReplyService = require('./replyService');
const client       = require('./steem');
const {
  FETCH_POSTS_PER_TAG,
  VIDEO_POST,
  NEWS_POST,
  BLOG_POST,
  FETCH_TOP_X_POSTS,
  HUNDREDX_USERNAME,
  GET_BLOG_ENTRIES,
  GET_CONTENT,
  DELETED,
}                  = require('../utils/constants');
const VIDEO_URLS   = require('../utils/videoUrls');
const idGenerator  = require('./idGenerator');

module.exports = {
  broadcastAndStorePost: function({ authenticatedUserInstance, permLink, title, body, tags }) {
    return authenticatedUserInstance.broadcastPost({ permLink, title, body, tags })
      .then(broadcastSuccess => {
        if (broadcastSuccess) {
          return authenticatedUserInstance.userInOurDb;
        }
      })
      .then(userRecord => {
        return this.fetchSingleSteemitPost(permLink, userRecord);
      })
      .catch(err => {
        new Error(err.error_description);
      })
  },

  reSyncPosts: function(posts, rankType) {
    for (const [tagIndex, postsByTag] of Object.entries(posts)) {
      for (const [postIndex, steemitPost] of Object.entries(postsByTag)) {
        if (!this.postIsEnglish(steemitPost)) {
          return;
        }
        // for each post from Steemit API...
        const newRanking = this.calculateNewRank(tagIndex, postIndex);
        const newRankingObj = this.generateProprietaryRankObject(rankType, newRanking);
        const postForOurDb = this.formatSteemitPost(steemitPost);

          UserModel
          .findOrCreate({
            where: {id: steemitPost.author + idGenerator.generate() },
            defaults: { name: steemitPost.author }
          })
          .spread((userRecord, created) => {
            return this.findOrCreatePost({...postForOurDb, ...newRankingObj}, userRecord);
          })
          .catch(err => console.log("trouble finding or creating post author", err));
      }
    }
  },

  getPostsOfAuthors: function(authors) {
    const authorNames =  authors.map(name => { name });
    return PostModel.findAll({
      include: [
         {
           model: UserModel,
           where: {
             [Op.or]: authorNames
           }
         }
      ],
    });
  },

  fetchSingleSteemitPost: async function(permlink, userRecord) {
   const storeSteemitPostInOurDb = (post) => {
     const postForOurDb = this.formatSteemitPost(post[0]);
     return this.findOrCreatePost(postForOurDb, userRecord);
    }
    const params = [[userRecord.id, permlink]];
    return client.sendAsync(GET_CONTENT, params, storeSteemitPostInOurDb);
  },

  findOrCreatePost: function(postObj, author) {
    return PostModel
      .findOrCreate({
        where: {id: postObj.id},
        defaults: { ...postObj, userId: author.id }
      }).spread((postInOurDb, postWasCreated) => {
        return postInOurDb;
      }).catch(err => console.log(err));
  },

  fetchHundredxResteemedPosts: async function() {
    const getHundredxPosts = (posts) => {
      const permLinkAndAuthors = this.extractFromSteemitResponse(posts[0]);
      const allHundredxResteemedPosts = permLinkAndAuthors.map(({ permLink, name }) => (
        this.findByPermLinkAndAuthor(permLink, name)
      ));

      return Promise.all(allHundredxResteemedPosts).catch(err => console.log(err));
    }
    const params = [[HUNDREDX_USERNAME,0,FETCH_TOP_X_POSTS]];
    return client.sendAsync(GET_BLOG_ENTRIES, params, getHundredxPosts);
  },

  deletePost: function({ permLink }) {
    const keyVal = {};
    keyVal[DELETED] = true;
    return PostModel.update(keyVal, {
      where: { permLink },
    }).catch(err => {
      throw new Error(err.error_description);
    });
  },

  // ===== PRIVATE

  postIsEnglish: function(post) {
    const body = post.body;
    const nonAsciiCharacters = /[^\u0000-\u00ff]/;  // if this regex matches, there are unicode characters
    let numberOfNonAsciiCharacters = 0;
    //for each character...
    for (let i = 0; i < body.length; i++) {
      if (nonAsciiCharacters.test(body[i])) {
        numberOfNonAsciiCharacters++;
      }
    }

    // if the percent of unicode characters is less than ten, we will
    // make an educated guess that this post is english
    const percentOfUnicodeCharacters = (100 * numberOfNonAsciiCharacters / body.length);
    return percentOfUnicodeCharacters < 10;
  },


  determinePostType: function(links, body) {
     if (!links) return BLOG_POST;
     if (links[0] === body) {
       return NEWS_POST;
     } else if (this.containsVideo(links)) {
       return VIDEO_POST;
     } else {
       return BLOG_POST;
     }
  },

  linkContainsVideoUrl: function(link) {
    for (const videoUrl of VIDEO_URLS) {
      if (link.includes(videoUrl)) {
        return true;
      }
    }
  },

  containsVideo: function(links) {
    for (let link of links) {
      if (this.linkContainsVideoUrl(link)) {
        return true;
      }
    }
      return false;
  },

  formatSteemitPost: function(steemitPost) {
    const metadata = JSON.parse(steemitPost.json_metadata);
    const convertedValue = Number.parseFloat(steemitPost.pending_payout_value.split("SBD")[0]);
    const tags = metadata.tags;
    const links = metadata.links;
    return {
      id: steemitPost.id,
      permLink: steemitPost.permlink,
      title: steemitPost.title,
      body: steemitPost.body,
      createdAt: steemitPost.created,
      netVotes: steemitPost.net_votes,
      children: steemitPost.children,
      pendingPayoutValue: convertedValue,
      postType: this.determinePostType(links, steemitPost.body),
      tag1: tags[0],
      tag2: tags[2],
      tag3: tags[3],
      tag4: tags[4],
      tag5: tags[5],
    }
  },

  extractFromSteemitResponse: function(posts) {
    return posts.map(post => (
      { permLink: post.permlink, name: post.author }
    ))
  },
  findByPermLinkAndAuthor: function(permLink, name) {
    return PostModel.findOne({
      where: { permLink },
      include: [
        {
          model: UserModel,
          where: { name }
        }
      ]
    }).catch(err => console.log("trouble finding existing post", err));
  },

  calculateNewRank: function(tagRank, postRank) {
    return tagRank * FETCH_POSTS_PER_TAG + parseInt(postRank);
  },

  generateProprietaryRankObject: function(rankType, newRanking) {
    const obj = {};
    obj[rankType] = newRanking;
    return obj
  },

  resetRanking: function(rankType) {
     //updates all posts of rankType, since children is always greater than 0
     const keyVal = {};
     keyVal[rankType] = 9999;
    return PostModel.update(keyVal, {
      where: {children: {[Op.gte]: 0} }
    })
      .catch(err => console.log(err));
  },
}
