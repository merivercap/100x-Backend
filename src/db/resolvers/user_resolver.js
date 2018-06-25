const userTypeDefs = ``;

const userResolver = {
  Query: {
    userLogin(_, args) {  // { accessToken: "aGwefh423" }
      return "success";
    },
  }
};


module.exports = {
  userTypeDefs,
  userResolver,
}
