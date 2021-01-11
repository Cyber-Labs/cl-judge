const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.name
 * @param {String} param0.problem_statement
 * @param {String} param0.type
 * @param {String} param0.input_format
 * @param {String} param0.output_format
 * @param {String} param0.constraints
 * @param {Array} param0.options
 * @param {Number} param0.correct
 * @param {String} param0.difficulty
 * @param {Array} param0.tags
 * @return {Promise}
 */

function createQuestion({
  username,
  name,
  problem_statement: problemStatement,
  type,
  input_format: inputFormat,
  output_format: outputFormat,
  constraints,
  options,
  correct,
  difficulty,
  tags,
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
          `INSERT INTO questions(creator,type,name,problem_statement,input_format,
            output_format,constraints,options,correct,difficulty)
            VALUES(?,?,?,?,?,?,?,?,?,?)`,
          [
            username,
            type,
            name,
            problemStatement,
            inputFormat,
            outputFormat,
            constraints,
            JSON.stringify(options),
            correct,
            difficulty,
          ],
          (error, results) => {
            if (error || !results) {
              connection.release()
              return reject(error)
            }

            const questionId = results.insertId

            connection.query(
              `INSERT INTO questions_editors(question_id, editor, access) VALUES(?,?,?)`,
              [questionId, username, 'write'],
              (error) => {
                if (error) {
                  return connection.rollback(() => {
                    connection.release()
                    return reject(error)
                  })
                }
                if (!tags || !tags.length) {
                  return connection.commit((error) => {
                    if (error) {
                      return connection.rollback(() => {
                        connection.release()
                        return reject(error)
                      })
                    }
                    connection.release()
                    return resolve({
                      message: 'Question created successfully',
                      questionId,
                    })
                  })
                }

                let query = `INSERT INTO questions_tags(question_id, tag_id) VALUES`
                const queryArr = []

                tags.forEach((tag, idx) => {
                  query += `(?,?)`
                  if (idx !== tags.length - 1) {
                    query += `,`
                  }
                  queryArr.push(questionId, tag)
                })

                connection.query(query, queryArr, (error) => {
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
                      message: 'Question created successfully',
                      questionId,
                    })
                  })
                })
              }
            )
          }
        )
      })
    })
  })
}

module.exports = createQuestion
