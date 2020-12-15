const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.query
 * @return {Promise}
 */

function getModeratorContests({ username, query }) {
  return new Promise((resolve, reject) => {
    const limit = Number(query.limit)
    let sqlQuery = `SELECT * FROM contests WHERE id IN (SELECT contest_id FROM contests_moderators WHERE moderator=?)`
    let arr = [username]
    if (limit && limit > 0) {
      sqlQuery += ` LIMIT ?`
      arr.push(limit)
    }
    pool.query(sqlQuery, arr, (error, results) => {
      if (error || results === undefined) {
        return reject(error)
      }
      if (!results || !results.length) {
        return reject('There are no contests for which the user is moderator')
      }
      return resolve(results)
    })
  })
}

module.exports = getModeratorContests
