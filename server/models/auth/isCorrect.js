const { pool } = require('../database')
const bcrypt = require('bcryptjs')
/**
 *
 * @param {String} username
 * @param {String} password
 * @return {Promise}
 */

function isCorrect(username, password) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT secret FROM user WHERE username=? AND verified=?`,
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
            return resolve(false)
          } else {
            return resolve(true)
          }
        })
      }
    )
  })
}

module.exports = isCorrect
