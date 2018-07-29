const { mergeSchemas } = require('graphql-tools');

const PostSchema = require('./post');
const CommentSchema = require('./comment');
const UserSchema = require('./user');

module.exports = mergeSchemas({
  schemas: [
    PostSchema,
    CommentSchema,
    UserSchema,
  ],
});
