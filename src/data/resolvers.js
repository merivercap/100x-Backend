// Date: {
//   __serialize(value) {
//
//     return value; // value sent to the client
//   },
//
//   __parseValue(value) {
//
//     return value;
//   },
//   __parseLiteral(ast) {
//     return JSON.parse(JSON.stringify(ast)).value;
//   }
// }

const { Post, Tag } = require('./connectors');

const resolvers = {
  Query: {
    allPosts(_, args) {
      return Post.findAll();
    }
  }
};

module.exports = {
  resolvers
};
