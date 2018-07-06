const testUtils = require('../../lib/testUtils');
const User = require('./index').User;

describe('User', () => {
  beforeAll(() => {
    return testUtils.initializeDatabase();
  });

  afterAll(() => {
    return testUtils.clearDatabase();
  });

  test('save() should save', () => {
    const user = User.build(testUtils.createTestUserOpts());

    return user.save()
      .then(() => (
        User.findById(user.id)
      ))
      .then(fetchedUser => {
        expect(fetchedUser.id).toBe(user.id);
        expect(fetchedUser.name).toBe(user.name);
      });
  });
});
