const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Boolean} param0.writeAccess
 * @param {Number} param0.questionId
 * @return {Promise}
 */

function getAllEditorsReaders({ writeAccess, questionId }) {
  return new Promise((resolve, reject) => {
    let sqlQuery = `SELECT editor, access from questions_editors WHERE question_id=?`
    let arr = [questionId]
    if (writeAccess) {
      sqlQuery += ` AND access=?`
      arr.push('write')
    }
    pool.query(sqlQuery, arr, (error, results) => {
      if (error || results === undefined) {
        return reject(error)
      }
      if (!results.length) {
        return reject('Invalid question Id')
      }
      return resolve({
        question_data: results,
      })
    })
  })
}

module.exports = getAllEditorsReaders
