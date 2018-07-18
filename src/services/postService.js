// This is what you meant by post service right?

// TODO: create postService to communicate with model and import postService
// const Post = db.sequelize.models.post;

const db        = require('../models/sequelize/index');
const PostModel = db.sequelize.models.post;
const Op        = db.Sequelize.Op;

module.exports = {

  createPost: function(post, { newHotRanking }) {
    const metadata = JSON.parse(post.json_metadata);
    const convertedValue = Number.parseFloat(post.pending_payout_value.split("SBD")[0]);
    const tags = metadata.tags;
    PostModel.create({
      id: post.id,
      authorId: 1,
      permLink: post.permlink,
      title: post.title,
      body: post.body,
      createdAt: post.created,
      netVotes: post.net_votes,
      children: post.children,
      pendingPayoutValue: convertedValue,
      trending: 1,
      hot: newHotRanking,
      postType: 0,
      tag1: tags[0],
      tag2: tags[1],
      tag3: tags[2],
      tag4: tags[3],
      tag5: tags[4],
    })
    .catch(err => {
      console.log('Error creating post: ', err);
    });;
  },
  updatePostRanking: function(options) {
    const postId = options.postId || '';
    const newHotRanking = options.newHotRanking || null;
    const newTrendingRanking = options.newTrendingRanking || null;

    if (newHotRanking) {
      PostModel.update(
        { hot: newHotRanking },
        { where: { id: postId } }
      )
      .catch(err => console.log('Trouble updating hot ranking', err));
    } else if (newTrendingRanking) {
      PostModel.update(
        { trending: newTrendingRanking },
        { where: { id: postId } }
      )
      .catch(err => console.log('Trouble updating trending ranking', err));
    }
  },
  postExists: function(postId) {
    return PostModel.count({ where: {id: postId} })
                    .catch(err => console.log('Failed to count post', err));
  },
  resetRanking: function(rankType) {
     //updates all posts of rankType, since children is always greater than 0
     const keyVal = {};
     keyVal[rankType] = 9999;
    return PostModel.update(keyVal, {
      where: {children: {[Op.gte]: 0} }
    })
      .catch(err => console.log(err));
  }
}
