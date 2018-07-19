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
        return author.createPost(testUtils.createTestPostOpts());
      })
      .then((post) => {
        postId = post.id;
        return Post.findById(post.id);
      })
      .then(fetchedPost => {
        expect(fetchedPost.id).toBe(postId);
        expect(fetchedPost.userId).toBe(author.id);
        expect(fetchedPost.createdAt).not.toBe(null);
      });

  });
});
