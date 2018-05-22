const casual = require('casual');
const mocks = {
  String: () => 'It works!',
  Post: () => ({
    author: () => casual.username,
    permlink: () => casual.word,
    title: () => casual.title,
    body: () => casual.sentences(n = 3),
    created: () => casual.unix_time,
    net_votes: () => casual.integer(from = 0, to = 1000),
    children: () => casual.integer(from = 0, to = 1000),
    curator_payout_value: () => casual.integer(from = 0, to = 1000),
    trending: () => casual.integer(from = 0, to = 10000),
    post_type: () => casual.integer(from = 0, to = 2),
  }),
  Tag: () => ({ name: taggings[Math.floor(Math.random()*taggings.length)] }),
};

const taggings = [
  'bitcoin',
  'crypto',
  'cryptocurrency',
  'blockchain',
  'beyondbitcoin',
  'ethereum',
  'eos',
];

module.exports = {
  mocks
};
