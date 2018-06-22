'use strict';
module.exports = (sequelize, DataTypes) => {

  const Post = sequelize.define('post', {
    author: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
    permlink: { type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex' },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.STRING, allowNull: false },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { isDate: true }
    },
    net_votes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: true, min: 0 }
    },
    children: { type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: true, min: 0 }
    },
    curator_payout_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { isFloat: true, min: 0 }
    },
    trending: { type:
      DataTypes.INTEGER,
      validate: { isInt: true }
    },
    hot: {
      type: DataTypes.INTEGER,
      validate: { isInt: true }
    },
    post_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { isInt: true, min: 0, max: 2 }
    },
    tag1: { type: DataTypes.STRING, allowNull: false },
    tag2: { type: DataTypes.STRING },
    tag3: { type: DataTypes.STRING },
    tag4: { type: DataTypes.STRING },
    tag5: { type: DataTypes.STRING }
  });

  return Post;
};
