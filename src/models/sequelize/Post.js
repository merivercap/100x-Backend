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

  Post.prototype.toJSON = function() {
    return dbUtils.jsonFormat(this.get());
  }

  return Post;
};
