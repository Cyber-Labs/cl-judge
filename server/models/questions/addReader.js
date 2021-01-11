const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.reader
 * @param {Number} param0.questionId
 * @return {Promise}
 */

function addReader({ username, reader, questionId }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO questions_editors(question_id, editor, access) 
       SELECT question_id, ?, ? FROM questions_editors WHERE editor=? AND question_id=?`,
      [reader, 'read', username, questionId],
      (error, results) => {
        if (error || !results) {
          const { code } = error
          if (code === 'ER_DUP_ENTRY') {
            return reject('The user already has read access to the question')
          }
          return reject(error)
        }

        if (!results.affectedRows) {
          return reject(
            'Invalid question_id or you do not have required permissions.'
          )
        }

        return resolve('Reader added successfully')
      }
    )
  })
}

module.exports = addReader
