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
}                  = require('../utils/constants');
const VIDEO_URLS   = require('../utils/videoUrls');

module.exports = {
  reSyncPosts: function(posts, rankType) {
    for (const [tagIndex, postsByTag] of Object.entries(posts)) {
      for (const [index, post] of Object.entries(postsByTag)) {
        const newRanking = (tagIndex) * FETCH_POSTS_PER_TAG + parseInt(index);
        const updateRankType = {};
        updateRankType[rankType] = newRanking;
        UserModel
          .findOrCreate({
            where: {name: post.author},
            defaults: { id: _.random(10000)}
          })
          .spread((user, created) => {
            return this.findOrCreatePost(post, user, updateRankType);
          });

      }
    }
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

  getPostsOfAuthors: function(authors) {
    const authorObjs = authors.map(name => {
      return { name };
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

  determinePostType: function(links, body) {
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
  postProperFormat: function(post) {
    const metadata = JSON.parse(post.json_metadata);
    const convertedValue = Number.parseFloat(post.pending_payout_value.split("SBD")[0]);
    const tags = metadata.tags;
    const links = metadata.links;
    return {
      permLink: post.permlink,
      title: post.title,
      body: post.body,
      createdAt: post.created,
      netVotes: post.net_votes,
      children: post.children,
      pendingPayoutValue: convertedValue,
      postType: this.determinePostType(links, post.body),
      tag1: tags[0],
      tag2: tags[2],
      tag3: tags[3],
      tag4: tags[4],
      tag5: tags[5],
    }
  },
  findOrCreatePost: function(post, author, updateRankType) {
    return PostModel
      .findOrCreate({
        where: {id: post.id},
        defaults: { ...this.postProperFormat(post), userId: author.id }
      }).spread((post, created) => {
        if (created) {
          const replyFetcher = new ReplyService(post);
          return post.update(updateRankType)
            // .then(replyFetcher.getAllComments());
        } else {
          return post.update(updateRankType);
        }
      });
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
    });
  },
}
