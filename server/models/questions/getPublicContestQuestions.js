const { pool } = require('../database')

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
 * @param {Number} param0.cursor
 * @param {String} param0.search
 * @param {Number} param0.limit
 * @param {Number} param0.tag_ids
 * @param {String} param0.difficulty
 * @param {Number} param0.per_page_size
 * @param {Number} param0.page
 * @param {Array} param0.sort
 * @return {Promise}
 */

function getPublicContestQuestions({
  search,
  tag_ids: tagIds,
  difficulty,
  per_page_size: perPageSize,
  page,
  sort,
}) {
  return new Promise((resolve, reject) => {
    let countQuery = `SELECT COUNT(DISTINCT q.id) AS total FROM contests c
                      INNER JOIN contests_questions cq ON c.id=cq.contest_id
                      INNER JOIN questions q ON cq.question_id=q.id `
    const cQArr = []

    let query = `SELECT DISTINCT q.id, q.name, q.difficulty FROM contests c
                INNER JOIN contests_questions cq ON c.id=cq.contest_id
                INNER JOIN questions q ON cq.question_id=q.id `
    const qArr = []

    if (
      tagIds &&
      Array.isArray(tagIds) &&
      !tagIds.some(isNaN) &&
      tagIds.length
    ) {
      countQuery += `INNER JOIN questions_tags qt ON q.id=qt.question_id WHERE qt.tag_id IN(`
      query += `INNER JOIN questions_tags qt ON q.id=qt.question_id WHERE qt.tag_id IN(`

      tagIds.forEach((tagId, idx) => {
        query += `?`
        countQuery += `?`
        if (idx != tagIds.length - 1) {
          query += `,`
          countQuery += `,`
        } else {
          query += `)`
          countQuery += `)`
        }
        qArr.push(+tagId)
        cQArr.push(+tagId)
      })
      query += ` AND `
      countQuery += ` AND `
    } else {
      query += `WHERE `
      countQuery += `WHERE `
    }

    if (
      difficulty &&
      (difficulty === 'easy' ||
        difficulty === 'medium' ||
        difficulty === 'hard')
    ) {
      query += `difficulty=? AND `
      countQuery += `difficulty=? AND `
      qArr.push(difficulty)
      cQArr.push(difficulty)
    }

    query += `c.end_time <= NOW() AND c.public  = 1 AND c.confidential_questions = 0 `
    countQuery += `c.end_time <= NOW() AND c.public  = 1 AND c.confidential_questions = 0 `

    if (search) {
      query += `AND q.name LIKE ? `
      countQuery += `AND q.name LIKE ? `
      qArr.push(`%${search}%`)
      cQArr.push(`%${search}%`)
    }

    if (sort) {
      query += sortQuery(JSON.parse(sort))
    }

    pool.query(countQuery, cQArr, (error, results) => {
      if (error || !results) {
        return reject(error)
      }

      const totalRows = results[0].total
      if (!totalRows) {
        return resolve({ questions: [], page_count: 0 })
      }

      perPageSize = parseInt(perPageSize, 10) || 10
      const numPages = Math.ceil(totalRows / perPageSize)
      const pageIndex = parseInt(page, 10) - 1 || 0
      const offset = perPageSize * pageIndex

      query += ` LIMIT ?,?`
      qArr.push(offset, perPageSize)

      pool.query(query, qArr, (error, results) => {
        if (error || !results) {
          return reject(error)
        }
        return resolve({ questions: results, page_count: numPages })
      })
    })
  })
}

module.exports = getPublicContestQuestions
