const { Post } = require('./connectors');
const { client } = require('../server/steemAPI');


const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};

const resolvers = {
  Query: {
    allPosts(_, args) {
      return Post.findAll({order: [['hot', 'ASC']]});
    },
    getPostContent(_, args) {
      return client.sendAsync(args.message, [args.params], (result) => console.log("replies")) // e.g. message: "get_content", params: ["steemit", "firstpost"]
    },
  },
  Post: {}
};

module.exports = {
  resolvers
};
