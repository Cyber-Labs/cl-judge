const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function updateQuestion({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId, question_id: questionId } = params
    const { max_score: maxScore } = body
    pool.query(
      `UPDATE contests_questions SET max_score = ? WHERE question_id = ? 
        AND contest_id = ? AND EXISTS (SELECT 1 FROM contests_moderators WHERE contest_id = ? AND moderator = ?)`,
      [maxScore, questionId, contestId, contestId, username],
      (error, res) => {
        if (error || res === undefined) {
          return reject(error)
        } else {
          const { affectedRows } = res
          if (affectedRows === 0) {
            return reject(
              'Invalid question Id or you do not have the required permissions'
            )
          }
          return resolve('Question updated successfully!!')
        }
      }
    )
  })
}

module.exports = updateQuestion
