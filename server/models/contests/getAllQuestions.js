const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 */

function getAllQuestions({ username, params }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    pool.query(
      `SELECT question_id, q.name, q.difficulty, q.type, max_score FROM contests_questions cq
      INNER JOIN contests c ON c.id = cq.contest_id
      INNER JOIN questions q ON cq.question_id=q.id
      WHERE c.id=? AND (EXISTS(SELECT 1 from contests_moderators WHERE contest_id=? AND moderator=?) OR (NOW()>c.end_time AND c.confidential_questions=0 AND (c.public = 1
      OR EXISTS(SELECT 1 FROM contests_groups cg INNER JOIN user_groups ug ON cg.group_id = ug.group_id 
        WHERE ug.username = ? AND cg.contest_id = ?))) OR (NOW()>=c.start_time AND NOW()<=c.end_time AND EXISTS(SELECT 1 FROM contests_participants WHERE contest_id=? AND participant=?)))`,
      [contestId, contestId, username, username, contestId, contestId, username],
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

module.exports = getAllQuestions
