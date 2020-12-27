const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @param {Object} param0.query
 * @return {Promise}
 */

function getMCQSubmission({ username, params, query }) {
  return new Promise((resolve, reject) => {
    const { contestId, submissionId } = params
    const { moderator } = query
    let queryString, queryArr
    if (moderator) {
      queryString = `SELECT question_id, contest_id, username, response, submission_time, score, judged 
      FROM mcq_submissions 
      WHERE id=? AND EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?)`
      queryArr = [submissionId, contestId, username]
    } else {
      queryString = `SELECT question_id, contest_id, username, response, submission_time,
      score*EXISTS(SELECT 1 FROM contests WHERE id=? AND (NOW()>end_time OR show_leaderboard=1)) AS score, judged 
      FROM mcq_submissions 
      WHERE id=? AND username=? AND EXISTS(SELECT 1 FROM contests WHERE id=? 
      AND ((NOW()>=start_time AND NOW()<=end_time) 
      OR (NOW()>end_time AND confidential_questions=0)))`
      queryArr = [contestId, submissionId, username, contestId]
    }

    pool.query(queryString, queryArr, (error, results) => {
      if (error) {
        reject(error)
      }
      if (!results.length) {
        reject('You do not have permission to view this submission')
      }
      return resolve(results)
    })
  })
}

module.exports = getMCQSubmission
