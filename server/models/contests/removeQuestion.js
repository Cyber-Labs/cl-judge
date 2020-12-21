const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function removeQuestion({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { question_id: questionId } = body
    pool.query(
      `DELETE FROM contests_questions WHERE question_id = ? AND contest_id = (SELECT contest_id FROM contests_moderators WHERE contest_id=? AND moderator=?)`,
      [questionId, contestId, username],
      (error, res) => {
        if (error || res === undefined) {
          return reject(error)
        } else {
          const { affectedRows } = res
          if (!affectedRows) {
            return reject(
              'Invalid question Id or the user do not have required permissions'
            )
          }
          return resolve('Question removed successfully!!')
        }
      }
    )
  })
}

module.exports = removeQuestion
