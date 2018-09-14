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
        unique: true,
        index: true,
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
      children: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'children',
        allowNull: false,
        validate: {
          isInt: true,
          min: 0
        }
      },
      depth: {
        type: DataTypes.INTEGER.UNSIGNED,
        field: 'depth',
        allowNull: false,
        validate: {
          isInt: true,
          min: 0
        }
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
    },
    {
      tableName: 'replies',
      freezeTableName: true
    }
  );

  Reply.associate = function (models) {
    models.Reply.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    models.Reply.belongsTo(models.Post, {
      foreignKey: {
        allowNull: false
      }
    });
    models.Reply.belongsTo(models.Reply, {as: 'parent'});
  };
  return Reply;
};
