/**
 * Let's stay away from having different logic in a single file
 * This file looks like it has logic for server, post/tag model,
 * and seeding db. let's modularize it so each file
 * is responsible for one task
 */

const Sequelize = require('sequelize');
const casual = require('casual');
const _ = require('lodash');

// DB
const { batchUpdate } = require('../database_update/batch');
const db = require('../data/db');

// Models
const PostModel = require('../models/post');

// Utils
const taggings = require('../utils/tagging-subjects');

db
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.sync().then(() => { // db.sync({force: true}) will drop all tables, effectively clearing the database...
  batchUpdate({ PostModel})
});

const Post = db.models.post;

module.exports = {
  Post,
}