const commentTypeDefs = ``;

const commentResolver = {
  Query: {
    createNewComment(_, args) {
      return "success";
    },
    updateComment(_, args) {
      return "success";
    },
    deleteComment(_, args) {
      return "success";
    },
    voteComment(_, args) {
      return "success"
    }
  }
};


module.exports = {
  commentTypeDefs,
  commentResolver,
}
