const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.keyword
 * @param {Number} param0.limit
 * @return {Promise}
 *
 */

function searchUsers({ keyword, limit }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT username, admission_number FROM users WHERE (username LIKE '${keyword}%' OR admission_number LIKE '${keyword}%') AND (verified=1) LIMIT ?`,
      [limit],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

module.exports = searchUsers
