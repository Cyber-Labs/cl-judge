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
  return filterParams
    .map(({ id, value }) =>
      value.length
        ? ` AND ${id} IN (${value
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
      .map(
        ({ id, desc }) =>
          `${id === 'rank' ? '`rank`' : id} ${desc ? 'DESC' : 'ASC'}`
      )
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

function getQuestionLeaderboard({ username, params, query }) {
  return new Promise((resolve, reject) => {
    const { contestId, questionId } = params
    const {
      type,
      search,
      sort,
      page,
      size,
      download_csv: downloadCSV,
      filters,
    } = query

    let countQuery = `SELECT COUNT(*) AS total
    FROM ${type === 'mcq' ? 'mcq_submissions' : 'subjective_submissions'} s 
    INNER JOIN users u ON  s.username=u.username
    WHERE contest_id=? AND question_id=? AND  
    (EXISTS (SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) 
    OR EXISTS(SELECT 1 FROM contests WHERE id=? AND show_leaderboard=1)) `
    const countQueryArr = [
      contestId,
      questionId,
      contestId,
      username,
      contestId,
    ]

    let mainQuery = `SELECT u.username, full_name, score, submission_time, judged, 
    RANK() OVER (PARTITION BY contest_id, question_id ORDER BY score DESC, submission_time ASC) \`rank\`
    FROM ${type === 'mcq' ? 'mcq_submissions' : 'subjective_submissions'} s
    INNER JOIN users u ON s.username=u.username
    WHERE contest_id=? AND question_id=?`
    const mainQueryArr = [contestId, questionId]

    if (search) {
      countQuery += ` AND (u.username LIKE '${search}%' OR u.full_name LIKE '${search}%' OR u.admission_number LIKE '${search}%') `
      mainQuery += ` AND (u.username LIKE '${search}%' OR u.full_name LIKE '${search}%' OR u.admission_number LIKE '${search}%') `
    }

    if (filters) {
      countQuery += filterQuery(JSON.parse(filters))
      mainQuery += filterQuery(JSON.parse(filters))
    }

    if (sort) {
      mainQuery += sortQuery(JSON.parse(sort))
    }

    pool.query(countQuery, countQueryArr, (error, countResults) => {
      if (error || !Array.isArray(countResults) || !countResults.length) {
        reject(error || 'Invalid Query')
      }

      const totalRows = countResults[0].total
      if (!totalRows) {
        return resolve({ leaderboard: [], page_count: totalRows })
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
        return resolve({ leaderboard: results, page_count: numPages })
      })
    })
  })
}

module.exports = getQuestionLeaderboard
