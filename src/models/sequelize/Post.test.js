const testUtils = require('../../lib/testUtils');
const { User, Post } = require('./index');

describe('Post', () => {
  beforeAll(() => {
    return testUtils.initializeDatabase();
  });

  afterAll(() => {
    return testUtils.clearDatabase();
  });

  test('save() should save', () => {
    const author = User.build(testUtils.createTestUserOpts());
    const user = User.build(testUtils.createTestUserOpts());
    var post;

    return Promise.all([ author.save(), user.save() ])
      .then(() => {
        post = Post.build(testUtils.createTestPostOpts());
        post.authorId = author.id;

        return post.save();
      })
      .then(() => {
        return Post.findById(post.id);
      })
      .then(fetchedPost => {
        expect(fetchedPost.id).toBe(post.id);

        const json = fetchedPost.toJSON();
        expect(json.authorId).toBe(author.id);
        expect(json.createdAt).not.toBe(null);
      });

  });
});
