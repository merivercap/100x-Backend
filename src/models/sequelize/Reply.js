const dbUtils = require('./dbUtils');
const idGenerator = require('../../services/idGenerator');

module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    'reply',
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
      pendingPayoutValue: {
        type: DataTypes.FLOAT,
        field: 'pendingPayoutValue',
        allowNull: false,
        validate: {
          isFloat: true,
          min: 0
        }
      },
    },
    {
      tableName: 'replies',
      freezeTableName: true
    }
  );

  Reply.associate = function (models) {
    models.Reply.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    models.Reply.belongsTo(models.Post, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    models.Reply.hasOne(models.Reply, {
      onDelete: "CASCADE",
      as: 'parent',
      foreignKey: 'parentId',
      useJunctionTable: false
    });
  };
  return Reply;
};
