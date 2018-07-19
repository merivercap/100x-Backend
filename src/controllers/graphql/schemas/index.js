const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const db = require('../connectors/connectors');

const Post = db.sequelize.models.post;
const User = db.sequelize.models.user;

const resolvers = {
  Query: {
    user(_, args) {
      return User.find({ where: args });
    },
    getAllPosts: async (_, args) => {
      console.log('getting all posts');
      return Post.findAll({order: [['hot', 'ASC']], limit: 100});
    },
    getPost(_,args) {
      return Post.findById(args.postId);
    },
  },
  User: {
    posts(user) {
      return user.getPosts();
    }
  },
  Post: {
    user(post) {
      return post.getUser();
    }
  }
};

const typeDefs = `
scalar Date

type User {
  id: Int!
  createdAt: Date
  name: String
  posts: [Post]
}
type Post {
  id: Int!
  user: User
  permLink: String!
  title: String!
  body: String!
  createdAat: Date!
  netVotes: Int!
  children: Int!
  pendingPayoutValue: Float!
  trending: Int
  hot: Int
  postType: Int!
  tag1: String!
  tag2: String
  tag3: String
  tag4: String
  tag5: String
}
type Query {
  user(name: String): User
  allUsers: [User]
  getAllPosts: [Post]
  getPost(postId: Int): Post
}
`;
module.exports = makeExecutableSchema({ typeDefs, resolvers });

// const { mergeSchemas } = require('graphql-tools');
//
// const PostSchema = require('./post');
// const CommentSchema = require('./comment');
// const UserSchema = require('./user');
//
// module.exports = mergeSchemas({
//   schemas: [
//     PostSchema,
//     CommentSchema,
//     UserSchema,
//   ],
// });
