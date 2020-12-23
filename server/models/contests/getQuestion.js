const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 */

function getQuestion({ username, params }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId, question_id: questionId } = params
    pool.query(
      `SELECT question_id, max_score FROM contests_questions cq
      INNER JOIN contests c ON c.id = cq.contest_id WHERE (cq.question_id = ?) 
      AND ((c.public = 1) OR (EXISTS(SELECT 1 FROM contests_groups cg INNER JOIN user_groups ug ON cg.group_id = ug.group_id 
        WHERE ug.username = ? AND cg.contest_id = ?)))`,
      [questionId, username, contestId],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        if (!results || !results.length) {
          return reject(
            'You do not have moderator access of the contest. If the contest is active, make sure that you are registered as a participant.'
          )
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getQuestion
