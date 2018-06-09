const { client } = require('../server/steemAPI');
const casual = require('casual');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const { Post } = require('../data/connectors');

const cb = (result, { PostModel }) => {
  resetRanking(PostModel).then(() => {
    for (const [index, post] of result.entries()) {
      updateIfUnique(post, index, PostModel)
    }
  });

}

const batchUpdate = ({PostModel}) => {
  const result = client.sendAsync('get_discussions_by_hot', [{"tag":"bitcoin","limit":10}], cb, { PostModel});
  return 0;
};

const updateIfUnique = (post, index, PostModel) => {
  return PostModel.count({ where: {id: post.id}})
    .then(count => {
      if (count != 0) {
        PostModel.update({ hot: index }, { where: {id: post.id} })
      } else {
        createPost(post, index, PostModel);
      }
    });
};

const createPost = (post, index ,PostModel) => {
  PostModel.create({
    id: post.id,
    author: post.author,
    permlink: post.permlink,
    title: post.title,
    body: post.body,
    created: post.created,
    net_votes: post.net_votes,
    children: post.children,
    curator_payout_value: post.curator_payout_value,
    trending: 1,
    hot: index,
    post_type: 0
  }).then((post) => {
    return post.createTag({
      name: "bitcoin",
    });
  });
}

// ==============

// Now that we have 1 tag done....
//
// 1)  We can do for multiple tags.  Not sure if we can use the same lightrpc request.  Apparently we can send 20 get_content by X requewsts in a single command.
//
// Still not sure how to do that. Or how the results would come back.  Maybe we don't need to sort =).
//
// 2) Come up with algorithm that determines ordering of hot and trending for meshed api.steemit.com requests.
//

// =====

// works for trending.

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
