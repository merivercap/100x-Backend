const dbUtils = require('./dbUtils');

describe('dbUtils', () => {
  test('validateMetaFields with invalid field should throw exception', () => {
    const schema = {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        phone: { type: 'number' }
      },
    };
    const meta = { first_name: 'john', phone: 'galt' };

    try {
      const results = dbUtils.validateMetaFields(schema, meta);
      expect(results).toBe(false);
    } catch (error) {
      expect(error).not.toBe(undefined);
    }
  });

  test('validateMetaFields with valid fields should not throw exception', () => {
    const schema = {
      type: 'object',
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
      },
    };
    const meta = { first_name: 'john', last_name: 'galt' };

    try {
      dbUtils.validateMetaFields(schema, meta);
    } catch (error) {
      expect(error).toBe(undefined);
    }
  });

  test('jsonFormat should camelcase and merge meta fields', () => {
    const instance = {
      id: 1,
      postId: 2,
      meta: {
        title: 'title',
        body: 'body',
      },
    };

    const json = dbUtils.jsonFormat(instance);
    expect(json.title).toBe(instance.meta.title);
    expect(json.body).toBe(instance.meta.body);
  });
});