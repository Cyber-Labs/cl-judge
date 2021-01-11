const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.editor
 * @param {Number} param0.questionId
 * @return {Promise}
 */

function updateEditorToReader({ username, editor, questionId }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE questions_editors q1 SET q1.access = ? 
            WHERE q1.question_id = (
                SELECT q1.question_id FROM
                (SELECT DISTINCT question_id FROM questions_editors q2 WHERE q2.question_id=? AND q2.editor=? AND q2.access=?) AS qid
            )
            AND q1.editor=?`,
      ['read', questionId, username, 'write', editor],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        const { affectedRows } = results
        if (!affectedRows) {
          return reject(
            'Invalid question Id or you do not have the required permissions'
          )
        }
        return resolve('User access updated to read only successfully')
      }
    )
  })
}

module.exports = updateEditorToReader
