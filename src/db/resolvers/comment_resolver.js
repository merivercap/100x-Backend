const commentTypeDefs = ``;

const commentResolver = {
  Query: {
    createNewComment(_, args) {  // { title: "Bitcoin is awesome", body: "This is my bitcoin post", tags: ["bitcoin", "ethereum"], author: "steemit", permlink: "firstpost" }
      return "success";
    },
    updateComment(_, args) { // { title: "Bitcoin is awsome", body: "This is my bitcoin post", tags: ["bitcoin", "ethereum"], author: "steemit", permlink: "firstpost" }
      return "success";
    },
    deleteComment(_, args) { // { author: "steemit", permlink: "firstpost" }
      return "success";
    },
    voteComment(_, args) {
      return "success"  // { author: "steemit", permlink: "firstpost", upvote: 0, vote_percent: 100 }
    }
  }
};


module.exports = {
  commentTypeDefs,
  commentResolver,
}
