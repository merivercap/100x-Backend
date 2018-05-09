const db = require('./db');

/**
 * Add user to RDS
 *
 * Input:
 *  user: {uuid: str,
 *         email: str,
 *         firstName: str,
 *         lastName: str,
 *         password: str}
 * Output:
 *   Promise<mysqlRow, Error>
 */
function addUserToRDS(user) {
  const sql = 'INSERT INTO 100x.users (user_id, email, first_name, last_name) VALUES (?,?,?,?)';
  const params = [user.uuid, user.email, user.firstName, user.lastName];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

function fetchUserById(userId, callback) {
  const sql = `
    SELECT
      user_id as userId,
      email as email,
      first_name as firstName,
      last_name as lastName,
    FROM
      100x.users
    WHERE
      user_id = "${userId} limit 1
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("error in sql");
      return callback(err, null);
    } else if (rows == null || rows.length == 0) {
      console.log("null or zero");
      return callback(new Error("invalid row returned for user"), []);
    }
    console.log('fetched user ' + userId);
    return callback(null, rows[0]);
  });
}

function fetchUserByEmail(email, callback) {
  // sanity check
  if (typeof (email) !== 'string') {
    return new Error("email is not valid");
  }
  // normalize email
  email = email.toLowerCase();

  const sql = `
    SELECT
      user_id as userId,
      email as email,
      first_name as firstName,
      last_name as lastName,
    FROM
      100x.users
    WHERE 
      email = "${email}" limit 1
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return callback(err, null);
    } else if (rows == null || rows.length === 0) {
      return callback(new Error("invalid row returned for user"), rows);
    }
    return callback(null, rows[0]);
  });
}

function updateUser(userId, feats, callback) {
  let sql = `UPDATE 100x.users SET ? WHERE user_id = ?`;
  // TODO: verify that all features are valid
  db.query(sql, [feats, userId], (err, rows) => {
    if (err) {
      return callback(err, null);
    } else if (rows == null) {
      return callback(new Error("unable to update user"), rows);
    }
    return callback(null, rows);
  });
}

function updateUserById(userId, feats) {
  new Promise((resolve, reject) => {
    updateUser(userId, feats, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

function updateUserByEmail(userEmail, feats, callback) {
  const sql = `UPDATE 100x.users SET ? WHERE email = ?`;
  // TODO: verify that all features are valid
  db.query(sql, [feats, userEmail], (err, rows) => {
    if (err) {
      return callback(err, null);
    } else if (rows == null) {
      return callback(new Error("unable to update user"), rows);
    }
    return callback(null, rows);
  });
}

function fetchUserByIdPromise(id) {
  return new Promise((resolve, reject) => {
    fetchUserById(id, (err, res) => {
      if (err && !res) { return reject(err); }
      return resolve(res);
    });
  });
}

module.exports.addUserToRDS = addUserToRDS;
module.exports.fetchUserById = fetchUserById;
module.exports.fetchUserByEmail = fetchUserByEmail;
module.exports.updateUser = updateUser;
module.exports.updateUserById = updateUserById;
module.exports.updateUserByEmail = updateUserByEmail;
module.exports.fetchUserByIdPromise = fetchUserByIdPromise;
