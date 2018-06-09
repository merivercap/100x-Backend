const { client } = require('../server/steemAPI');
const casual = require('casual');

const cb = (result, { PostModel }) => {

  for (const [index, post] of result.entries()) {
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
}


const batchUpdate = ({PostModel}) => {
  const result = client.sendAsync('get_discussions_by_hot', [{"tag":"bitcoin","limit":10}], cb, { PostModel});

  return 0;
};

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
//
//
//
// Then make sure that posts dont already exists.

// 1)) UPdate all posts in the data base to be 9999 trending and hot.
//
// 2) Do the ordering personalized algorithm.  If the post exists in the database, then just update the trending/hot column.


// =====

// works for trending.

module.exports = {
  batchUpdate
};
