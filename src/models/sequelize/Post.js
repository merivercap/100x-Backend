const dbUtils = require('./dbUtils');
const idGenerator = require('../../services/idGenerator');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'post',
    {
      id: {
        type: DataTypes.STRING(60),
        defaultValue: () => idGenerator.generate(),
        primaryKey: true
      },
      authorId: {
        type: DataTypes.STRING(60),
        field: 'author_id',
        index: true,
        allowNull: false,
        unique: 'compositeIndex'
      },
      permLink: {
        type: DataTypes.STRING,
        field: 'perm_link',
        allowNull: false,
        unique: 'compositeIndex'
      },
      title: {
        type: DataTypes.STRING(48),
        field: 'title',
        allowNull: false,
        validates: {
          len: [5, 50]
        }
      },
      body: {
        type: DataTypes.TEXT,
        field: 'body',
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
        validate: { isDate: true }
      },
      netVotes: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'net_votes',
        allowNull: false,
        validate: {
          isInt: true,
          min: 0
        }
      },
      children: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'children',
        allowNull: false,
        validate: {
          isInt: true,
          min: 0
        }
      },
      curatorPayoutValue: {
        type: DataTypes.FLOAT,
        field: 'curator_payout_value',
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0
        }
      },
      trending: {
        type: DataTypes.INTEGER,
        field: 'trending',
        validate: {
          isInt: true
        }
      },
      hot: {
        type: DataTypes.INTEGER,
        field: 'hot',
        validate: {
          isInt: true
        }
      },
      postType: {
        type: DataTypes.INTEGER,
        field: 'post_type',
        allowNull: false,
        default: 0, // default is blog
        validate: {
          isInt: true,
          min: 0,
          max: 2
        }
      },
      tag1: { type: DataTypes.STRING, allowNull: false },
      tag2: { type: DataTypes.STRING },
      tag3: { type: DataTypes.STRING },
      tag4: { type: DataTypes.STRING },
      tag5: { type: DataTypes.STRING }
    },
    {
      tableName: 'posts',
      freezeTableName: true
    }
  );

  // Post.prototype.toJSON = () => {
  //   return dbUtils.jsonFormat(this.get());
  // }

  /**
   * Sequelize models come with built in #build & #save methods so
   * we probably don't have to make a custom create method ourselves
   * leaving commented just in case
   */
  // Post.prototype.createPost = (post, { newHotRanking }) => {
  //   const metadata = JSON.parse(post.json_metadata);
  //   const tags = metadata.tags;
  //   PostModel.create({
  //     id: post.id,
  //     author: post.author,
  //     permlink: post.permlink,
  //     title: post.title,
  //     body: post.body,
  //     created: post.created,
  //     net_votes: post.net_votes,
  //     children: post.children,
  //     curator_payout_value: 10,
  //     trending: 1,
  //     hot: newHotRanking,
  //     post_type: 0,
  //     tag1: tags[0],
  //     tag2: tags[1],
  //     tag3: tags[2],
  //     tag4: tags[3],
  //     tag5: tags[4],
  //   })
  //   .catch(err => {
  //     console.log('Error creating post: ', err);
  //   });;
  // }

  Post.prototype.updatePostRanking = options => {
    const postId = options.postId || '';
    const newHotRanking = options.newHotRanking || null;
    const newTrendingRanking = options.newTrendingRanking || null;

    if (newHotRanking) {
      PostModel.update(
        { hot: newHotRanking },
        { where: { id: postId } }
      )
        .catch(err => console.log("Trouble updating hot ranking", err));
    } else if (newTrendingRanking) {
      PostModel.update(
        { trending: newTrendingRanking },
        { where: { id: postId } }
      )
        .catch(err => console.log("Trouble updating trending ranking", err));
    }
  }

  Post.prototype.postExists = postId => {
    return PostModel
      .count({ where: { id: postId } })
      .catch(err => console.log('Failed to count post', err));
  }

  Post.prototype.resetRanking = rankType => {
    //updates all posts of rankType, since children is always greater than 0
    const keyVal = {};
    keyVal[rankType] = 9999;
    return PostModel
      .update(keyVal, {
        where: { children: { [Op.gte]: 0 } }
      })
      .catch(err => console.log(err));
  }

  return Post;
};
