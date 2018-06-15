/**
 * Looks like these functions belong in a model/controller 
 */

const { client } = require('../server/steemAPI');
const casual = require('casual');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Post } = require('../data/connectors');
const taggings = require('../utils/tagging-subjects');

const cb = (result, { PostModel }) => { // let's stay away from 
  // 1/2 letter variable names and be descriptive as possible as to what the code block does
  // and will we be needing callbacks since we're using promises?
  resetRanking(PostModel).then(() => {
    // Is there a way to do this without nesting loops?
    for (let index = 0; index < result[0].length; index++) {
      for (let tagIndex = 0; tagIndex < result.length; tagIndex++) {
        let newHotRanking = index * 10 + tagIndex;
        let post = result[tagIndex][index];
        let tag = taggings[tagIndex];
        updateIfUnique(post, PostModel, { newHotRanking, tag });
      }
    }
  });
}

const batchUpdate = ({PostModel}) => {

  params = taggings.map((tag) => {
    return [{"tag":tag,"limit":10}]
  });

  client.sendAsync('get_discussions_by_hot', params, cb, { PostModel });
  return 0;
};

const updateIfUnique = (post, PostModel, { newHotRanking, tag }) => {
  return PostModel.count({ where: {id: post.id}})
    .then(count => {
      if (count != 0) {
        PostModel.update({ hot: newHotRanking }, { where: {id: post.id} })
      } else {
        createPost(post, PostModel, { newHotRanking, tag });
      }
    });
};

const createPost = (post, PostModel, { newHotRanking, tag }) => {
  const actualLink = "https://busy.org/@" + post.author + "/" + post.permlink;
  PostModel.create({
    id: post.id,
    author: post.author,
    permlink: actualLink,
    title: post.title,
    body: post.body,
    created: post.created,
    net_votes: post.net_votes,
    children: post.children,
    curator_payout_value: post.curator_payout_value,
    trending: 1,
    hot: newHotRanking,
    post_type: 0,
    tag1: tag
  });
}

const resetRanking = (PostModel) => {
  return PostModel.update({
    hot: 9999,
  }, {
    where: {
      children: {
        [Op.gte]: 0
      }
    }
  });
}

module.exports = {
  batchUpdate
};
