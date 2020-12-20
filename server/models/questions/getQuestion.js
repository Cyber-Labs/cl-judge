const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.questionId
 * @return {Promise}
 */

function getQuestion({ username, questionId }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM 
        questions q 
        INNER JOIN questions_editors qe ON q.id=qe.question_id
        WHERE q.id=? AND qe.editor=?`,
      [questionId, username],
      (error, results) => {
        if (error || !results) {
          return reject(error)
        }
        if (!results.length) {
          return reject('Invalid question id')
        }
        return resolve({ question_data: results[0] })
      }
    )
  })
}

module.exports = getQuestion
