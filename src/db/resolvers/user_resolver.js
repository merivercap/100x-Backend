const userTypeDefs = ``;

const userResolver = {
  Query: {
    getLoginLink(_,args) {
      return "https://steemconnect.com/oauth2/authorize?client_id";
    },
  }
};


module.exports = {
  userTypeDefs,
  userResolver,
};
