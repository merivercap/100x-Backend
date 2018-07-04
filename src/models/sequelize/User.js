const _ = require('lodash');
const dbUtils = require('./dbUtils');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.STRING(60),
        primaryKey: true,
        field: 'user_id',
      },
      name: {
        type: DataTypes.STRING(20),
        field: 'name',
        unique: true,
        index: true,
        validate: {
          len: [2, 20]
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      }
    },
    {
      tableName: 'users',
      freezeTableName: true
    }
  );

  User.prototype.toJSON = function() {
    return dbUtils.jsonFormat(this.get());
  }

  return User;
};
