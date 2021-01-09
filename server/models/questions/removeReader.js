const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.reader
 * @param {Number} param0.questionId
 * @return {Promise}
 */

function removeReader({ username, reader, questionId }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM questions_editors a WHERE
       EXISTS(SELECT 1 FROM (SELECT * FROM questions_editors) b WHERE editor=? AND question_id=?)
       AND editor=? AND access=?`,
      [username, questionId, reader, 'read'],
      (error, results) => {
        if (error || !results) {
          return reject(error)
        }

        if (!results.affectedRows) {
          return reject(
            'Invalid question_id or you do not have required permissions'
          )
        }

        return resolve('Reader removed successfully')
      }
    )
  })
}

module.exports = removeReader
