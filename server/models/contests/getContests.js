const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.query
 * @return {Promise}
 */

function getContests({ username, query }) {
  return new Promise((resolve, reject) => {
    const { status, page, size } = query
    let countQuery = `SELECT COUNT(*) as total FROM contests 
    WHERE  (public=1 OR EXISTS(SELECT 1 FROM contests_groups cg INNER JOIN user_groups ug 
    ON cg.group_id = ug.group_id WHERE ug.username=?)) `

    let sqlQuery = `SELECT id, creator, name, start_time, end_time, about, rules, prizes, show_leaderboard, confidential_questions FROM contests 
    WHERE  (public=1 OR EXISTS(SELECT 1 FROM contests_groups cg INNER JOIN user_groups ug 
    ON cg.group_id = ug.group_id WHERE ug.username=?)) `

    const queryArr = [username]

    if (status === 'past') {
      countQuery += ` AND NOW() > end_time `
      sqlQuery += ` AND NOW() > end_time ORDER BY end_time DESC`
    } else if (status === 'active') {
      countQuery += ` AND NOW() >= start_time AND NOW() <= end_time `
      sqlQuery += ` AND NOW() >= start_time AND NOW() <= end_time ORDER BY start_time`
    } else if (status === 'upcoming') {
      countQuery += ` AND NOW() < start_time `
      sqlQuery += ` AND NOW() < start_time ORDER BY start_time`
    } else {
      return reject('Status required')
    }

    pool.query(countQuery, queryArr, (error, countResults) => {
      if (error || countResults === undefined) {
        return reject(error)
      }
      const totalRows = countResults[0].total
      if (!totalRows) {
        return resolve({ contests: [], page_count: totalRows })
      }
      const pageSize = parseInt(size, 10) || 10
      const numPages = Math.ceil(totalRows / pageSize)
      const pageIndex = parseInt(page, 10) || 0
      const offset = pageSize * pageIndex

      sqlQuery += ` LIMIT ?,?`
      queryArr.push(offset, pageSize)
      pool.query(sqlQuery, queryArr, (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        return resolve({ contests: results, page_count: numPages })
      })
    })
  })
}

module.exports = getContests
