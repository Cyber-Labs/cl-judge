const { pool } = require('../database')
const bcrypt = require('bcryptjs')
/**
 *
 * @param {String} username
 * @param {String} password
 * @return {Promise}
 */

function isPasswordCorrect(username, password) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT secret, is_admin FROM users WHERE username=? AND verified=?`,
      [username, 1],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        if (!results.length) {
          return reject('Account does not exist or email not verified')
        }
        bcrypt.compare(password, results[0].secret, (error, res) => {
          if (error) {
            return reject(error)
          }

          if (!res) {
            return resolve({ correct: false, isAdmin: false })
          } else {
            return resolve({ correct: true, isAdmin: results[0].is_admin })
          }
        })
      }
    )
  })
}

module.exports = isPasswordCorrect
