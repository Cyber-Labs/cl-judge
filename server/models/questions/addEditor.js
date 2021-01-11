const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.editor
 * @param {Number} param0.questionId
 * @return {Promise}
 */

function addEditor({ username, editor, questionId }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `INSERT INTO questions_editors(question_id, editor, access) 
       SELECT question_id, ?, ? FROM questions_editors WHERE editor=? AND question_id=? AND access=?
       ON DUPLICATE KEY UPDATE access=?`,
      [editor, 'write', username, questionId, 'write', 'write'],
      (error, results) => {
        if (error || !results) {
          return reject(error)
        }

        if (!results.affectedRows) {
          return reject(
            'Invalid question_id or you do not have required permissions.'
          )
        }

        return resolve('Editor added successfully')
      }
    )
  })
}

module.exports = addEditor
