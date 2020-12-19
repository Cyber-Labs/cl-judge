/* eslint-disable no-async-promise-executor */
const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.query
 * @return {Promise}
 */

function getContests({ username, query }) {
  return new Promise((resolve, reject) => {
    const { status } = query
    let limit = Number(query.limit)
    if (!limit) {
      limit = 5
    }

    let sqlQuery = `SELECT id, creator, name, start_time, end_time FROM contests 
    WHERE  (public=1 OR EXISTS(SELECT 1 FROM contests_groups cg INNER JOIN user_groups ug 
    ON cg.group_id = ug.group_id WHERE ug.username=?))`

    if (status === 'past') {
      sqlQuery += ` AND NOW() > end_time ORDER BY end_time DESC`
    } else if (status === 'active') {
      sqlQuery += ` AND NOW() > start_time AND NOW() < end_time ORDER BY start_time`
    } else if (status === 'upcoming') {
      sqlQuery += ` AND NOW() < start_time ORDER BY start_time`
    } else {
      return reject('Status required')
    }
    sqlQuery += ` LIMIT ?`
    pool.query(sqlQuery, [username, limit], (error, results) => {
      if (error || results === undefined) {
        return reject(error)
      }
      if (!results.length) {
        return reject(`No ${status} contests for which the user is eligible`)
      }
      return resolve(results)
    })
  })
}

module.exports = getContests
