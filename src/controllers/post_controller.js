const db        = require('../models/dao');
const PostModel = db.sequelize.models.post;
const Op        = db.Sequelize.Op;

const createPost = (post, { newHotRanking, tag }) => {
  PostModel.create({
    id: post.id,
    author: post.author,
    permlink: post.permlink,
    title: post.title,
    body: post.body,
    created: post.created,
    net_votes: post.net_votes,
    children: post.children,
    curator_payout_value: 10,
    trending: 1,
    hot: newHotRanking,
    post_type: 0,
    tag1: tag,
  }).catch(function(err) {
    console.log("Error creating post: ", err);
  });;
}

const updatePostRanking = (options) => {
  const postId = options.postId || '';
  const newHotRanking = options.newHotRanking || null;
  const newTrendingRanking = options.newTrendingRanking || null;

  if (newHotRanking) {
    PostModel.update(
      { hot: newHotRanking },
      { where: { id: postId } }
    )
    .catch(err => console.log("Trouble updating hot ranking", err));
  } else if (newTrendingRanking) {
    PostModel.update(
      { trending: newTrendingRanking },
      { where: { id: postId } }
    )
    .catch(err => console.log("Trouble updating trending ranking", err));
  }
}

const postExists = (postId) => {
  return PostModel.count({ where: {id: postId} })
                  .catch(err => console.log("Failed to count post", err));
}

const resetRanking = (rankType) => {
   //updates all posts of rankType, since children is always greater than 0
  return PostModel.update({
      hot: 9999
  }, {
    where: {children: {[Op.gte]: 0} }
  })
    .catch(err => console.log(err));
}


module.exports = {
  updatePostRanking,
  postExists,
  createPost,
  resetRanking,
}
