const { pool } = require('../database')

/**
 *
 * @param {String} username
 * @return {Promise}
 */

function getUser(username) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT username,full_name,email,admission_number,mobile,department,branch,bio,logged_in FROM user WHERE username=?`,
      [username],
      (error, results) => {
        if (error || !results.length) {
          return reject('User not found')
        }
        const isLoggedIn = results[0].logged_in
        if (!isLoggedIn) {
          return reject('User not logged in, please login first!')
        }
        return resolve(results[0])
      }
    )
  })
}

module.exports = getUser
