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
      name: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false,
        unique: true,
        index: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'created_at',
        allowNull: true
      },
      voteValue: {
        type: DataTypes.STRING,
        field: 'voteValue',
        allowNull: true
      },
      location: {
        type: DataTypes.STRING,
        field: 'location',
        allowNull: true
      },
      realLifeName: {
        type: DataTypes.STRING,
        field: 'realLifeName',
        allowNull: true
      },
      introBlurb: {
        type: DataTypes.STRING,
        field: 'introBlurb',
        allowNull: true
      },
      reputationScore: {
        type: DataTypes.STRING,
        field: 'reputationScore',
        allowNull: true
      },
      profileImageUrl: {
        type: DataTypes.STRING,
        field: 'profileImageUrl',
        allowNull: true
      },
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
