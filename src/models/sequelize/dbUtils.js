const logger = require('../../services/logger');
const _ = require('lodash');
const camelcaseKeys = require('camelcase-keys');
const Ajv = require('ajv');
const ajv = new Ajv();

module.exports = {
  validateMetaFields: (schema, meta) => {
    const validate = ajv.compile(schema);
    const valid = validate(meta);
    if (!valid) {
      logger.error(validate.errors);
      const message = validate.errors.map(error => {
        return `${error.params.additionalProperty} ${error.message}`;
      }).join(', ');
      throw new Error(message);
    }
    return valid;
  },
  /**
   * This camelcases the meta JSON field and merges it with the parent
   */
  jsonFormat: (values) => {
    var newValues = _.clone(values);

    if (newValues && newValues.meta) {
      var newMetaValues = camelcaseKeys(values.meta);
      nevValues = _.merge(newValues, newMetaValues);
      newValues = _.omit(newValues, ['meta']);
    }

    // TODO why do duplicated underscored values retain in the values?
    newValues = _.omitBy(newValues, (value, key) => {
      const hasUnderscore = key.indexOf('_') > -1;
      const hasDuplicateUnderscoreKey = Object.keys(newValues).includes(_.camelCase(key));

      return hasUnderscore && hasDuplicateUnderscoreKey;
    });

    return newValues;
  },
};
