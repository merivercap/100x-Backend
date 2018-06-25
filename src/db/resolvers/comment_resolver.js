const commentTypeDefs = ``;

const commentResolver = {
  Query: {
    createNewComment(_, args) {  // { accessToken: "gkjdshjklhj23kjhGFD", title: "Bitcoin is awesome", body: "This is my bitcoin post", tags: ["bitcoin", "ethereum"], author: "steemit", permlink: "firstpost" }
      return "success";
    },
    updateComment(_, args) { // { accessToken: "gkjdshjklhj23kjhGFD", title: "Bitcoin is awsome", body: "This is my bitcoin post", tags: ["bitcoin", "ethereum"], author: "steemit", permlink: "firstpost" }
      return "success";
    },
    deleteComment(_, args) { // { accessToken: "gkjdshjklhj23kjhGFD", author: "steemit", permlink: "firstpost" }
      return "success";
    },
    voteComment(_, args) {
      return "success"  // { accessToken: "gkjdshjklhj23kjhGFD", author: "steemit", permlink: "firstpost", upvote: 0, vote_percent: 100 }
    }
  }
};


module.exports = {
  commentTypeDefs,
  commentResolver,
}
