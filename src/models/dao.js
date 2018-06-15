/** 
 * After converting the post/tag models into a class let's create
 * a data access object (dao) file, which will be responsible
 * for importing all of the models, then exporting all of the
 * public functions. 
 * ie:
 * 
 * const post = require('./post');
 * const tag = requiree('./tag');
 * 
 * // post functions
 * module.exports.insertPost = post.insertPost;
 * module.exports.updatePost = post.updatePost;
 * 
 * // tag functions
 * module.exports.insertTag = tag.insertTag;
 * module.exports.fetchTagsByBlogId = tags.fetchTagsByBlogId;
 */