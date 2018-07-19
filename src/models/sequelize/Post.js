const dbUtils = require('./dbUtils');
const idGenerator = require('../../services/idGenerator');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'post',
    {
      id: {
        type: DataTypes.INTEGER,
        defaultValue: () => idGenerator.generate(),
        primaryKey: true,
        allowNull: false
      },
      permLink: {
        type: DataTypes.STRING,
        field: 'permLink',
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
        field: 'createdAt',
        defaultValue: DataTypes.NOW,
        validate: { isDate: true }
      },
      netVotes: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'netVotes',
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
      pendingPayoutValue: {
        type: DataTypes.FLOAT,
        field: 'pendingPayoutValue',
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0
        }
      },
      trending: {
        type: DataTypes.INTEGER,
        field: 'trending',
        defaultValue: 9999,
        validate: {
          isInt: true
        }
      },
      hot: {
        type: DataTypes.INTEGER,
        field: 'hot',
        defaultValue: 9999,
        validate: {
          isInt: true
        }
      },
      postType: {
        type: DataTypes.INTEGER,
        field: 'postType',
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

  Post.associate = function (models) {
    models.Post.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    models.Post.hasMany(models.Reply);
  };



  return Post;
};
