const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function addQuestion({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { question_id: questionId, max_score: maxScore } = body
    pool.query(
      `INSERT INTO contests_questions (contest_id, question_id, max_score) SELECT contest_id, ?, ? FROM contests_moderators WHERE contest_id=? AND moderator=?`,
      [questionId, maxScore, contestId, username],
      (error, res) => {
        if (error || res === undefined) {
          const { code } = error
          if (code === 'ER_DUP_ENTRY') {
            return reject('The question is already added to the contest')
          }
          return reject(error)
        } else {
          const { affectedRows } = res
          if (!affectedRows) {
            return reject(
              'Invalid question Id or the user do not have required permissions'
            )
          }
          return resolve('Question added successfully!!')
        }
      }
    )
  })
}

module.exports = addQuestion
