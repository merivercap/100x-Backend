const _ = require('lodash');
const dbUtils = require('./dbUtils');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
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
    models.User.hasMany(models.Reply);
  };

  // User.prototype.toJSON = () => {
  //   return dbUtils.jsonFormat(this.get());
  // }

  return User;
};
