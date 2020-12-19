const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.contestId
 * @param {Number} param0.questionId
 * @param {String} param0.subjective_submission
 * @param {Number} param0.mcq_submission
 * @return {Promise}
 */

// For practise, keep only coding questions
// User should have already registered for the contest for active contest

function createSubmission({
  username,
  contestId,
  questionId,
  subjective_submission: subjectiveSubmission,
  mcq_submission: mcqSubmission,
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
        let insertionQuery
        let queryArr = [questionId, contestId, username]
        if (mcqSubmission) {
          insertionQuery = `INSERT INTO mcq_submissions(question_id,contest_id,username,submission_time,response,judged,score)
          SELECT ?,?,?,NOW(),?,1,(?=q.correct)*cq.max_score FROM questions q INNER JOIN contests_questions cq ON q.id=cq.question_id
          WHERE q.id=? AND cq.contest_id=? AND q.type=?
          AND EXISTS(SELECT 1 FROM contests WHERE id=? AND NOW()>=start_time AND NOW()<=end_time)
          AND EXISTS(SELECT 1 FROM contests_participants WHERE contests_id=? AND participant=?)`
          queryArr.push(
            mcqSubmission,
            mcqSubmission,
            questionId,
            contestId,
            'mcq',
            contestId,
            contestId,
            username
          )
        } else if (subjectiveSubmission) {
          insertionQuery = `INSERT INTO subjective_submissions(question_id,contest_id,username,submission_time,response)
          VALUES(?,?,?,NOW(),?) WHERE EXISTS(SELECT 1 FROM questions WHERE id=? AND type=?) 
          AND EXISTS(SELECT 1 FROM contests WHERE id=? AND NOW()>=start_time AND NOW()<=end_time)
          AND EXISTS(SELECT 1 FROM contests_participants WHERE contests_id=? AND participant=?)
          ON DUPLICATE KEY UPDATE response=?`
          queryArr.push(
            subjectiveSubmission,
            questionId,
            'subjective',
            contestId,
            contestId,
            username,
            subjectiveSubmission
          )
        }
        // Logic for coding questions to be added later

        connection.query(insertionQuery, queryArr, (error, results) => {
          if (error) {
            connection.release()
            if (mcqSubmission && error.code === 'ER_DUP_ENTRY')
              return reject(
                'You had already submitted response for the question'
              )
            else {
              return reject(
                'Either you have not registered for the contest or the contest has ended'
              )
            }
          }

          const submissionId = results.insertId

          if (subjectiveSubmission) {
            return connection.commit((error) => {
              if (error) {
                return connection.rollback(() => {
                  connection.release()
                  return reject(error)
                })
              }
              connection.release()
              return resolve({
                message: 'Response submitted successfully',
                submissionId,
              })
            })
          } else if (mcqSubmission) {
            connection.query(
              `INSERT INTO leaderboard(username,contest_id,score,total_time,attempted_count)
              SELECT ?,?,sub.score,sub.submission_time,1 FROM mcq_submissions sub
              INNER JOIN contests c ON c.id=sub.contest_id
              WHERE sub.id=?
              ON DUPLICATE KEY UPDATE 
              score=score+sub.score,
              total_time=(sub.score>0)*(sub.submission_time-c.start_time)+(sub.score=0)*(total_time),
              attempted_count=attempted_count+1`,
              [username, contestId, submissionId],
              (error, results) => {
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
                    message: 'Response submitted successfully',
                    submissionId,
                  })
                })
              }
            )
          }
        })
      })
    })
  })
}

module.exports = createSubmission
