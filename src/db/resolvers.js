const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

const { client } = require('../server/steemAPI');
const db = require('./connectors');
const Post = db.sequelize.models.post;


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
      return client.sendAsync(args.message, [args.params], (result) => {return result}) // e.g. message: "get_content", params: ["steemit", "firstpost"]
    },
  },
  Post: {}
};

module.exports = resolvers;
