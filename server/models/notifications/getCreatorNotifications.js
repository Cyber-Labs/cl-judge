const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.limit
 * @return {Promise}
 *
 */

function getCreatorNotifications({ username, limit }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id,heading,description,created_at FROM notifications WHERE creator=? ORDER BY created_at DESC LIMIT ${limit}`,
      [username],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getCreatorNotifications
