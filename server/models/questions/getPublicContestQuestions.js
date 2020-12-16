const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Number} param0.cursor
 * @param {String} param0.search
 * @param {Number} param0.limit
 * @param {Number} param0.tag_ids
 * @return {Promise}
 */

function getPublicContestQuestions({ cursor, limit, search, tag_ids: tagIds }) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM contests c
                INNER JOIN contests_questions cq ON c.id=cq.contest_id
                INNER JOIN questions q ON cq.question_id=q.id `
    const qArr = []

    if (tagIds && tagIds.length) {
      query += `INNER JOIN questions_tags qt ON q.id=qt.question_id WHERE qt.tag_id IN(`
      tagIds.forEach((tagId, idx) => {
        query += `?`
        if (idx != tagIds.length - 1) {
          query += `,`
        } else {
          query += `)`
        }
        qArr.push(+tagId)
      })
      query += ` AND `
    } else {
      query += `WHERE `
    }

    if (cursor) {
      query += `q.id>? AND `
      qArr.push(+cursor)
    }

    query += `c.end_time <= NOW() `

    if (search) {
      query += `AND q.name LIKE ? `
      qArr.push(`%${search}%`)
    }

    if (limit) {
      query += `LIMIT ?`
      qArr.push(+limit)
    }

    pool.query(query, qArr, (error, results) => {
      if (error || !results) {
        return reject(error)
      }
      return resolve({ questions_data: results })
    })
  })
}

module.exports = getPublicContestQuestions
