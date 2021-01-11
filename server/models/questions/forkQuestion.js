const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Number} param0.questionId
 * @return {Promise}
 */

function forkQuestion({ username, questionId }) {
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
          `INSERT INTO questions(creator,type,name,problem_statement,input_format,
            output_format,constraints,options,correct,difficulty)
            SELECT ?,type,name,problem_statement,input_format,
            output_format,constraints,options,correct,difficulty 
            FROM questions WHERE
            EXISTS(SELECT 1 FROM questions_editors WHERE question_id=? AND editor=?) 
            AND id=?`,
          [username, questionId, username, questionId],
          (error, results) => {
            if (error || !results) {
              connection.release()
              return reject(error)
            }

            if (!results.insertId) {
              return reject(
                'Invalid question_id or you do not have required permissions.'
              )
            }

            const forkedQuestionId = results.insertId

            connection.query(
              `INSERT INTO questions_editors(question_id, editor, access) VALUES(?,?,?)`,
              [forkedQuestionId, username, 'write'],
              (error) => {
                if (error) {
                  return connection.rollback(() => {
                    connection.release()
                    return reject(error)
                  })
                }

                connection.query(
                  `INSERT INTO questions_tags(question_id, tag_id)
                    SELECT ?, tag_id FROM questions_tags
                    WHERE question_id=?`,
                  [forkedQuestionId, questionId],
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
                        message: 'Question forked successfully',
                        forkedQuestionId,
                      })
                    })
                  }
                )
              }
            )
          }
        )
      })
    })
  })
}

module.exports = forkQuestion
