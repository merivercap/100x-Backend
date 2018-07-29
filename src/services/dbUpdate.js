const logger = require('./logger');
// const {
//   updatePostRanking,
//   postExists,
//   resetRanking,
//   createPost,
// } = require('../db/models/dao');
const { Post } = require('../models/sequelize').Post;
const client = require('../services/steem');
// const taggings = require('../utils/taggings');
const taggings = [ 'ethereum' ];


const batchUpdate = () => {
  const params = taggings.map(tag => [{ "tag": tag, "limit": 10 }] );
  client.sendAsync('get_discussions_by_hot', params, handleResult);
};

const handleResult = (result) => {
  Post.resetRanking()
    .then(() => {
      for (let index = 0; index < result[0].length; index++) {
        for (let tagIndex = 0; tagIndex < result.length; tagIndex++) {
          let newHotRanking = index * 10 + tagIndex;
          let post = result[tagIndex][index];
          updateIfUnique(post, { newHotRanking });
        }
      }
    })
    .catch(error => {
      logger.error(`ERROR: `, error);
    });
}

const updateIfUnique = (post, { newHotRanking }) => (
  Post.postExists(post.id)
    .then(postIndeedExists => {
      postIndeedExists ? Post.updatePostRanking({ postId, newHotRanking }) : Post.createPost(post, { newHotRanking });
    })
    .catch(error => {
      logger.error(`ERROR: `, error);
    })
);

module.exports = batchUpdate;
