const dbUtils = require('./dbUtils');
const idGenerator = require('../../services/idGenerator');

/**
 * TODO: implement the rest of Reply model and write tests
 */

module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
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
    },
    {
      tableName: 'replies',
      freezeTableName: true
    }
  );
  
  Post.prototype.toJSON = function () {
    return dbUtils.jsonFormat(this.get());
  }

  return Reply;
};
