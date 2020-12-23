const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.contestId
 * @param {Number} param0.submissionId
 * @param {Number} param0.score
 * @param {String} param0.feedback
 * @return {Promise}
 */

function gradeSubjectiveSubmission({
  username,
  contestId,
  submissionId,
  score,
  feedback,
}) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err)
      }
      connection.beginTransaction((err) => {
        if (err) {
          connection.release()
          return reject(err)
        }
        connection.query(
          `SELECT score, judged, username FROM subjective_submissions WHERE id=? 
        AND EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?)`,
          [submissionId, contestId, username],
          (error, results) => {
            if (error) {
              connection.release()
              return reject(error)
            }
            if (!Array.isArray(results) || !results.length) {
              connection.release()
              return reject('You do not have the required permissions')
            }
            const prevScore = results[0].score
            const prevJudged = results[0].judged
            const requestedUser = results[0].username
            let scoreUpdateQuery = `UPDATE subjective_submissions s
        INNER JOIN contests_questions cq
        ON s.contest_id=cq.contest_id AND s.question_id=cq.question_id
        SET s.judged=1, score=? `
            let queryArr = [score]
            if (feedback) {
              scoreUpdateQuery += `, feedback=? `
              queryArr.push(feedback)
            }
            scoreUpdateQuery += ` WHERE ?<=cq.max_score`
            queryArr.push(score)

            connection.query(scoreUpdateQuery, queryArr, (error, results) => {
              if (error) {
                return connection.rollback(() => {
                  connection.release()
                  return reject(error)
                })
              }
              const { affectedRows } = results
              if (!affectedRows) {
                return connection.rollback(() => {
                  connection.release()
                  return reject(
                    'Requested score is greater than maximum score for this question'
                  )
                })
              }
              connection.query(
                `INSERT INTO leaderboard(username,contest_id,total_score,total_time,attempted_count) 
              SELECT ?,?,sub.score,TIMEDIFF(sub.submission_time,c.start_time),1 FROM subjective_submissions sub
              INNER JOIN contests c ON c.id=sub.contest_id
              WHERE sub.id=?
              ON DUPLICATE KEY UPDATE 
              total_score=total_score+(sub.score-?),
              total_time=TIMEDIFF((SELECT MAX(st.submission_time) FROM
              (SELECT submission_time FROM mcq_submissions WHERE username=? AND score>0
              UNION ALL 
              SELECT submission_time FROM subjective_submissions WHERE username=? AND score>0) st),
              c.start_time),
              attempted_count=attempted_count+(?=0)`,
                [
                  username,
                  contestId,
                  submissionId,
                  prevScore,
                  requestedUser,
                  requestedUser,
                  prevJudged,
                ],
                (error) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release()
                      return reject(error)
                    })
                  }
                  return connection.commit((error) => {
                    if (error) {
                      return connection.rollback(() => {
                        connection.release()
                        return reject(error)
                      })
                    }
                    connection.release()
                    return resolve({
                      message: 'Submission graded successfully',
                      submissionId,
                    })
                  })
                }
              )
            })
          }
        )
      })
    })
  })
}

module.exports = gradeSubjectiveSubmission
