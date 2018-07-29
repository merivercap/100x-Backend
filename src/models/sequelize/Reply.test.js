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

  test('save() should save (Reply can have Replies)', () => {
    const commenter = User.build(testUtils.createTestUserOpts(1));
    const post = Post.build(testUtils.createTestPostOpts(1));
    const parentReply = Reply.build(testUtils.createTestReplyOpts(2));
    post.userId = commenter.id;
    parentReply.postId = post.id;
    parentReply.commenterId = commenter.id;

    return Promise.all([ commenter.save(), post.save(), parentReply.save() ])
      .then(() => {
        const nestedReply = Reply.build(testUtils.createTestReplyOpts(3));
        nestedReply.parentId = parentReply.id;
        nestedReply.postId = post.id;
        nestedReply.userId = commenter.id;
        return nestedReply.save();
      })
      .then((reply) => {
        return Reply.findById(reply.id);
      })
      .then(nestedReply => {
        expect(nestedReply.parentId).toBe(parentReply.id);
      });

  });

});
