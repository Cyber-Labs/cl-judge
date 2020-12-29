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
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.search
 * @param {Number} param0.tag_ids
 * @param {String} param0.difficulty
 * @param {Number} param0.per_page_size
 * @param {Number} param0.page
 * @param {Array} param0.sort
 * @return {Promise}
 */
function getEditorQuestions({
  username,
  search,
  tag_ids: tagIds,
  difficulty,
  per_page_size: perPageSize,
  page,
  sort,
}) {
  return new Promise((resolve, reject) => {
    let countQuery = `SELECT COUNT(DISTINCT q.id) AS total FROM questions q
                      INNER JOIN questions_editors qe ON q.id=qe.question_id `
    const cQArr = []

    let query = `SELECT DISTINCT q.id, q.name, q.difficulty, q.creator FROM questions q
                INNER JOIN questions_editors qe ON q.id=qe.question_id `
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

    query += ` qe.editor=? `
    countQuery += ` qe.editor=? `
    qArr.push(username)
    cQArr.push(username)

    if (
      difficulty &&
      (difficulty === 'easy' ||
        difficulty === 'medium' ||
        difficulty === 'hard')
    ) {
      query += ` AND difficulty=? `
      countQuery += ` AND difficulty=? `
      qArr.push(difficulty)
      cQArr.push(difficulty)
    }

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

module.exports = getEditorQuestions
