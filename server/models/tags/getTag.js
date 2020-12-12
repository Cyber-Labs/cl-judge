const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Object} param0.query
 * @return {Promise}
 */

function getTag({ query }) {
  return new Promise((resolve, reject) => {
    const keyword = query.keyword || ''
    pool.query(
      `SELECT * FROM tags WHERE name LIKE ?`,
      [`%${keyword}%`],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getTag
