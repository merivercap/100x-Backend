const userTypeDefs = ``;

const userResolver = {
  Query: {
    userLogin(_, args) {
      return "success";
    },
  }
};


module.exports = {
  userTypeDefs,
  userResolver,
}
