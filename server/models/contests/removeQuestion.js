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
      `DELETE FROM contests_questions WHERE (SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) AND question_id = ? AND contest_id = ?`,
      [contestId, username, questionId, contestId],
      (error, res) => {
        if (error || res === undefined) {
          return reject(error)
        } else {
          const { affectedRows } = res
          if (!affectedRows) {
            return reject(
              'Invalid question Id or you do not have moderator access to the contest'
            )
          }
          return resolve('Question removed successfully!!')
        }
      }
    )
  })
}

module.exports = removeQuestion
