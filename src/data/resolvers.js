// Date: {
//   __serialize(value) {
//
//     return value; // value sent to the client
//   },
//
//   __parseValue(value) {
//
//     return value;
//   },
//   __parseLiteral(ast) {
//     return JSON.parse(JSON.stringify(ast)).value;
//   }
// }

const resolvers = {
  Query: {
    allPosts() {
      return [{
        id: 1,
        author: 'steemit',
        permlink: 'firstpost',
        title: 'Welcome to Steem!',
        body: "Steemit is a social media platform where anyone can earn STEEM points by posting. The more people who like a post, the more STEEM the poster earns. Anyone can sell their STEEM for cash or vest it to boost their voting power.",
        created: 'Monday',
        net_votes: 100,
        children: 22,
        curator_payout_value: 1.7,
        trending: 1,
        post_type: 0, //blog == 0, video == 1, news == 2
        tags: [
          {
            id: 0,
            name: "blockchain"
          },
          {
            id: 1,
            name: "bitcoin"
          }
        ]
      }];
    }
  }
};

module.exports = {
  resolvers
};
