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

const { Post, Tag } = require('./connectors');

const resolvers = {
  Query: {
    allPosts(_, args) {
      return Post.findAll();
    }
  },
  Post: {
    tags(post) {
      return post.getTags();
    }
  }
};

module.exports = {
  resolvers
};
