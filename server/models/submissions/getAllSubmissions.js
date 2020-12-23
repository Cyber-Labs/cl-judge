const { pool } = require('../database')

/**
 *
 * @param {Array} filterParams
 * @return {String}
 */
function filterQuery(filterParams) {
  if (!Array.isArray(filterParams)) {
    return ''
  }
  const index = filterParams.find((param) => param.id === 'type')
  if (index) {
    filterParams.push(filterParams.splice(index, 1)[0])
  }
  return filterParams
    .map(({ id, value }) =>
      value.length
        ? ` ${id === 'type' ? 'HAVING' : 'AND'} ${id} IN (${value
            .map((val) => (typeof val === 'string' ? `'${val}'` : val))
            .join(',')}) `
        : ''
    )
    .join('')
}

/**
 *
 * @param {Array} sortParams
 * @return {String}
 */
function sortQuery(sortParams) {
  if (!Array.isArray(sortParams)) {
    return ''
  }
  return (
    ' ORDER BY ' +
    sortParams
      .map(({ id, desc }) => `${id} ${desc ? 'DESC' : 'ASC'}`)
      .join(', ')
  )
}

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @param {Object} param0.query
 * @return {Promise}
 */

function getAllSubmissions({ username, params, query }) {
  return new Promise((resolve, reject) => {
    const { contestId } = params
    const {
      search,
      sort,
      page,
      size,
      download_csv: downloadCSV,
      filters,
    } = query

    let countQuery = `SELECT COUNT(*) AS total FROM 
    (SELECT id, 'subjective' AS type FROM subjective_submissions WHERE contest_id=? AND EXISTS (SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) `
    let mainQuery = `SELECT s.id, s.question_id, q.name, s.type, s.username, s.submission_time, s.score, s.judged FROM 
    (SELECT id, question_id, 'subjective' AS type, username, submission_time, score, judged FROM subjective_submissions
     WHERE contest_id=? `

    if (search) {
      countQuery += ` AND username LIKE '${search}%' `
      mainQuery += ` AND username LIKE '${search}%' `
    }

    if (filters) {
      countQuery += filterQuery(JSON.parse(filters))
      mainQuery += filterQuery(JSON.parse(filters))
    }

    countQuery += ` UNION ALL SELECT id, 'mcq' AS type FROM mcq_submissions WHERE contest_id=? AND EXISTS (SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) `
    const countQueryArr = [
      contestId,
      contestId,
      username,
      contestId,
      contestId,
      username,
    ]

    mainQuery += ` UNION ALL SELECT id, question_id, 'mcq' AS type, username, submission_time, score, judged FROM mcq_submissions
    WHERE contest_id=? `
    const mainQueryArr = [contestId, contestId]

    if (search) {
      countQuery += ` AND username LIKE '${search}%' `
      mainQuery += ` AND username LIKE '${search}%' `
    }

    if (filters) {
      countQuery += filterQuery(JSON.parse(filters))
      mainQuery += filterQuery(JSON.parse(filters))
    }

    countQuery += `) s `
    mainQuery += `) s INNER JOIN questions q ON q.id=s.question_id `

    if (sort) {
      mainQuery += sortQuery(JSON.parse(sort))
    }

    pool.query(countQuery, countQueryArr, (error, countResults) => {
      if (error || !Array.isArray(countResults) || !countResults.length) {
        reject(error || 'Invalid Query')
      }

      const totalRows = countResults[0].total
      if (!totalRows) {
        return resolve({ submissions: [], page_count: totalRows })
      }
      const pageSize = downloadCSV ? totalRows : parseInt(size, 10) || 10
      const numPages = Math.ceil(totalRows / pageSize)
      const pageIndex = downloadCSV ? 0 : parseInt(page, 10) || 0
      const offset = pageSize * pageIndex

      mainQuery += ` LIMIT ?,?`
      mainQueryArr.push(offset, pageSize)
      pool.query(mainQuery, mainQueryArr, (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        return resolve({ submissions: results, page_count: numPages })
      })
    })
  })
}

module.exports = getAllSubmissions
