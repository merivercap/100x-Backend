const {
        updatePostRanking,
        postExists,
        resetRanking,
        createPost,
}               = require('../controllers/post_controller');
const client    = require('../server/steemAPI');
// const taggings  = require('../utils/taggings');
const taggings = [ //just bitcoin for now...we seem to be getting rate limited by the API.  I don't think it will be an issue for production.
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

    // This nested loop just comes up with a way to mesh together hot or trending
    // ranking for multiple tags from the API.  We are keeping this for now.
    // No easy way to do this.  Probably just stick this in the services folder
    // eventually.

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
