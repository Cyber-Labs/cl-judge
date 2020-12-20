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
    const cursor = Number(query.cursor)
    let sqlQuery = `SELECT c.id,name,creator,start_time,end_time,participants_count,public,confidential_questions FROM contests c JOIN contests_moderators cm ON c.id=cm.contest_id WHERE cm.moderator=? `
    let arr = [username]
    if (cursor) {
      sqlQuery += `AND c.id>? `
      arr.push(cursor)
    }
    if (limit && limit > 0) {
      sqlQuery += ` LIMIT ?`
      arr.push(limit)
    }
    pool.query(sqlQuery, arr, (error, results) => {
      if (error || results === undefined) {
        return reject(error)
      }
      return resolve(results)
    })
  })
}

module.exports = getModeratorContests
