const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 *
 */

function getAllParticipantsDetails({ username, params, query }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const {
      search,
      sort,
      page,
      size,
      download_csv: downloadCSV,
      filters,
    } = query
    let countQuery = `SELECT COUNT(*) AS total FROM users u
    INNER JOIN  contests_participants cp ON u.username = cp.participant 
    WHERE EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) AND cp.contest_id=?`

    let mainQuery = `SELECT username, full_name, admission_number, email, department, course, admission_year FROM users u
    INNER JOIN  contests_participants cp ON u.username = cp.participant 
    WHERE EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) AND cp.contest_id=?`
    const queryArr = [contestId, username, contestId]

    if (filters) {
      const filterParams = JSON.parse(filters)
      countQuery += filterParams
        .map(({ id, value }) =>
          value.length ? ` AND ${id} IN (${value.join(',')}) ` : ''
        )
        .join('')
      mainQuery += filterParams
        .map(({ id, value }) =>
          value.length ? ` AND ${id} IN (${value.join(',')}) ` : ''
        )
        .join('')
    }

    if (search) {
      countQuery += ` AND (username LIKE '${search}%' OR admission_number LIKE '${search}%' OR full_name LIKE '${search}%') `
      mainQuery += ` AND (username LIKE '${search}%' OR admission_number LIKE '${search}%' OR full_name LIKE '${search}%') `
    }

    if (sort) {
      const sortParams = JSON.parse(sort)
      countQuery += ` ORDER BY `
      countQuery += sortParams
        .map(({ id, desc }) => `${id} ${desc ? 'DESC' : 'ASC'}`)
        .join(', ')
      mainQuery += ` ORDER BY `
      mainQuery += sortParams
        .map(({ id, desc }) => `${id} ${desc ? 'DESC' : 'ASC'}`)
        .join(', ')
    }

    pool.query(countQuery, queryArr, (error, countResults) => {
      if (error || !countResults || !countResults.length) {
        reject(error)
      }
      if (typeof countResults === 'undefined') {
        reject('Invalid Query')
      }
      const totalRows = countResults[0].total
      if (!totalRows) {
        return resolve({ participant_records: [], page_count: totalRows })
      }
      const pageSize = downloadCSV ? totalRows : parseInt(size, 10) || 10
      const numPages = Math.ceil(totalRows / pageSize)
      const pageIndex = downloadCSV ? 0 : parseInt(page, 10) || 0
      const offset = pageSize * pageIndex

      mainQuery += ` LIMIT ?,?`
      queryArr.push(offset, pageSize)
      pool.query(mainQuery, queryArr, (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        return resolve({ participant_records: results, page_count: numPages })
      })
    })
  })
}

module.exports = getAllParticipantsDetails
