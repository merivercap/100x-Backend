const client = require('../server/steemAPI');
const casual = require('casual');

const db = require('../models/dao');


const Sequelize = db.Sequelize;
const PostModel = db.sequelize.models.post;
const Op = Sequelize.Op;


// const taggings = require('../utils/taggings');

const taggings = [
  'bitcoin',
];

const cb = (result) => {
  resetRanking().then(() => {
    for (let index = 0; index < result[0].length; index++) {
      for (let tagIndex = 0; tagIndex < result.length; tagIndex++) {
        let newHotRanking = index * 10 + tagIndex;
        let post = result[tagIndex][index];
        let tag = taggings[tagIndex];
        updateIfUnique(post, { newHotRanking, tag });
      }
    }
  });
}

const batchUpdate = () => {

  params = taggings.map((tag) => {
    return [{"tag":tag,"limit":10}]
  })

  client.sendAsync('get_discussions_by_hot', params, cb);
  return 0;
};

const updateIfUnique = (post, { newHotRanking, tag }) => {
  return PostModel.count({ where: {id: post.id}})
    .then(count => {
      if (count != 0) {
        PostModel.update(
          { hot: newHotRanking },
          { where: {id: post.id} }
        )
        .catch(err => console.log(err));
      } else {
        createPost(post, { newHotRanking, tag });
      }
    });
};

const createPost = (post, { newHotRanking, tag }) => {
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
    curator_payout_value: 10,
    trending: 1,
    hot: newHotRanking,
    post_type: 0,
    tag1: tag
  }).catch(function(err) {
    // print the error details
    console.log(err);
  });;
}

const resetRanking = () => {
  return PostModel.update({
    hot: 9999,
  }, {
    where: {
      children: {
        [Op.gte]: 0
      }
    }
  })
  .catch(err => console.log(err));
}

module.exports = batchUpdate;
