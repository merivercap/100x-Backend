const _ = require('lodash');
const dbUtils = require('./dbUtils');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
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

  User.associate = function(models) {
    models.User.hasMany(models.Post);
  };

  // User.prototype.toJSON = () => {
  //   return dbUtils.jsonFormat(this.get());
  // }

  return User;
};
