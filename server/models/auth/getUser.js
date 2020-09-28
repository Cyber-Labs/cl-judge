const { pool } = require('../database')

/**
 *
 * @param {String} username
 * @return {Promise}
 */

function getUser(username) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT username,full_name,email,admission_number,mobile FROM user WHERE username=?`,
      [username],
      (error, results) => {
        if (error || !results.length) {
          return reject('User not found')
        }
        return resolve(results[0])
      }
    )
  })
}

module.exports = getUser
