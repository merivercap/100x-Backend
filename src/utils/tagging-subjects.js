/**
 * taggings was being defined in multiple files. Let's keep our
 * code dry and create a separate utils file for importing 
 * variables used in multiple files. That way, if we ever have
 * to make a change to a var, we only have to change it in one
 * place and we know exactly where to find it
 */

const taggings = [
  'bitcoin',
  'crypto',
  'cryptocurrency',
  'blockchain',
  'beyondbitcoin',
  'ethereum',
  'eos',
];

module.exports = taggings;