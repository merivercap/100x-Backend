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
}                  = require('../utils/constants');
const VIDEO_URLS   = require('../utils/videoUrls');

module.exports = {
  reSyncPosts: function(posts, rankType) {
    for (const [tagIndex, postsByTag] of Object.entries(posts)) {
      for (const [postIndex, steemitPost] of Object.entries(postsByTag)) {
        // for each post from Steemit API...
        const newRanking = this.calculateNewRank(tagIndex, postIndex);
        const newRankingObj = this.generateProprietaryRankObject(rankType, newRanking);
        const postForOurDb = this.formatSteemitPost(steemitPost);

        UserModel
          .findOrCreate({
            where: {id: steemitPost.author},
          })
          .spread((userRecord, created) => {
            return this.findOrCreatePost({...postForOurDb, ...newRankingObj}, userRecord);
          })
          .catch(err => console.log("trouble finding or creating post author", err));

      }
    }
  },

  getPostsOfAuthors: function(authors) {
    const authorObjs = authors.map(name => {
      return { id: name };
    });
    return PostModel.findAll({
      include: [
         {
           model: UserModel,
           where: {
             [Op.or]: authorObjs
           }
         }
      ],
    });
  },

 fetchSingleSteemitPost: function(permlink, userInOurDb) {
   const storeSteemitPostInOurDb = (post) => {
     const postForOurDb = this.formatSteemitPost(post[0]);
     return this.findOrCreatePost(postForOurDb, userInOurDb);
    }
    const params = [[userInOurDb.name, permlink]];
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

  // ===== PRIVATE

  determinePostType: function(links) {
     if (!links) {
       // blog
       return BLOG_POST;
     } else if (this.containsVideo(links)) {
       // is video
       return VIDEO_POST;
     } else {
       // news
       return NEWS_POST;
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
      postType: this.determinePostType(links),
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
      where: { permLink }, //might work with userId is name....?
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
