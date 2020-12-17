const { pool } = require('../database')

const updateTags = (tags, questionId) => {
  return new Promise((resolve, reject) => {
    let query = `INSERT INTO questions_tags(question_id, tag_id) VALUES`
    const queryArr = []

    tags.forEach((tag, idx) => {
      query += `(?,?)`
      if (idx !== tags.length - 1) {
        query += `,`
      }
      queryArr.push(questionId, tag)
    })

    pool.query(query, queryArr, (error) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          return reject('The question already contains the requested tags')
        }
        return reject(`Could not update tags: ${error}`)
      }
      return resolve({
        message: 'Question updated successfully',
        questionId,
      })
    })
  })
}

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.questionId
 * @param {String} param0.questionFields.name
 * @param {String} param0.questionFields.problem_statement
 * @param {String} param0.questionFields.type
 * @param {String} param0.questionFields.input_format
 * @param {String} param0.questionFields.output_format
 * @param {String} param0.questionFields.constraints
 * @param {Array} param0.questionFields.options
 * @param {Number} param0.questionFields.correct
 * @param {String} param0.questionFields.difficulty
 * @param {Array} param0.tags
 * @return {Promise}
 */

function updateQuestion({ username, questionId, tags, questionFields }) {
  return new Promise((resolve, reject) => {
    let query = `UPDATE questions SET `
    const qArr = []

    Object.entries(questionFields).forEach(([fieldName, fieldValue]) => {
      if (fieldValue) {
        query += `${fieldName} = ?,`
        qArr.push(fieldValue)
      }
    })

    if (query[query.length - 1] === `,`) {
      query = query.slice(0, -1)

      query += ` WHERE EXISTS(SELECT 1 FROM questions_editors WHERE question_id=? AND editor=?) AND id=?`
      qArr.push(questionId, username, questionId)

      pool.query(query, qArr, (error, results) => {
        if (error || !results) {
          return reject(error)
        }

        if (!tags || !tags.length) {
          return resolve({
            message: 'Question updated successfully',
            questionId,
          })
        }
        updateTags(tags, questionId)
          .then((res) => resolve(res))
          .catch((err) => reject(err))
      })
    } else {
      updateTags(tags, questionId)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
    }
  })
}

module.exports = updateQuestion
