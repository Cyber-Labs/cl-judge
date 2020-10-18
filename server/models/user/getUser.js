const { pool } = require('../database')

/**
 *
 * @param {String} username
 * @return {Promise}
 */

function getUser(username) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT username,full_name,email,admission_number,admission_year,mobile,department,course,bio,profile_img FROM users WHERE username=?`,
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
