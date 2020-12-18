const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.cursor
 * @param {Number} param0.search
 * @param {Number} param0.limit
 * @return {Promise}
 */
function getEditorQuestions({ username, cursor, limit, search }) {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM questions q
                INNER JOIN questions_editors qe ON q.id=qe.question_id WHERE `
    const qArr = []

    if (cursor) {
      query += `q.id>? AND `
      qArr.push(+cursor)
    }

    query += `qe.editor=? `
    qArr.push(username)

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

module.exports = getEditorQuestions
