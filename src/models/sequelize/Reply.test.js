const testUtils = require('../../lib/testUtils');
const { User, Post, Reply } = require('./index');

describe('Reply', () => {
  beforeAll(() => {
    return testUtils.initializeDatabase();
  });

  afterAll(() => {
    return testUtils.clearDatabase();
  });

  test('save() should save (Commenter can write a reply)', () => {
    const post = Post.build(testUtils.createTestPostOpts());
    const commenter = User.build(testUtils.createTestUserOpts());
    let replyId;
    return Promise.all([ commenter.save(), post.save() ])
      .then(() => {
        const reply = Reply.build(testUtils.createTestReplyOpts());
        reply.postId = post.id;
        reply.userId = commenter.id;
        return reply.save();
      })
      .then((reply) => {
        replyId = reply.id;
        return Reply.findById(reply.id);
      })
      .then(fetchedReply => {
        expect(fetchedReply.id).toBe(replyId);
        expect(fetchedReply.userId).toBe(commenter.id);
        expect(fetchedReply.createdAt).not.toBe(null);
      });

  });

});
