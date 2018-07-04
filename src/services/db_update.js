const {
  updatePostRanking,
  postExists,
  resetRanking,
  createPost,
}                      = require('../db/models/dao');
const client           = require('../server/steemAPI');
// const taggings         = require('../utils/taggings');
const taggings = [
  'ethereum',
];

const batchUpdate = () => {
  params = taggings.map((tag) => {
    return [{"tag":tag,"limit":10}]
  })
  client.sendAsync('get_discussions_by_hot', params, handleResult);
};

const handleResult = (result) => {
  resetRanking().then(() => {


    for (let index = 0; index < result[0].length; index++) {
      for (let tagIndex = 0; tagIndex < result.length; tagIndex++) {
        let newHotRanking = index * 10 + tagIndex;
        let post = result[tagIndex][index];
        updateIfUnique(post, { newHotRanking });
      }
    }
  });
}


const updateIfUnique = (post, { newHotRanking }) => {
  const postId = post.id;
  return postExists(postId)
    .then(postIndeedExists => {
      if (postIndeedExists) {
        updatePostRanking({ postId, newHotRanking })
      } else {
        createPost(post, { newHotRanking });
      }
    });
};


module.exports = batchUpdate;
