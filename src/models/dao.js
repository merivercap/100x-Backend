const users = require('./users');

// users functions
module.exports.addUserToRDS = addUserToRDS;
module.exports.fetchUserById = fetchUserById;
module.exports.fetchUserByEmail = fetchUserByEmail;
module.exports.updateUser = updateUser;
module.exports.updateUserById = updateUserById;
module.exports.updateUserByEmail = updateUserByEmail;
module.exports.fetchUserByIdPromise = fetchUserByIdPromise;
