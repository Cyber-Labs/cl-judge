const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function addModerator({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { moderator: moderatorUsername } = body
    pool.query(
      `SELECT * FROM contests_moderators WHERE contest_id=? AND moderator=?`,
      [contestId, username],
      (error, results) => {
        if (error) {
          return reject(error)
        } else if (!results || !results.length) {
          return reject(
            'Invalid contest ID or you do not have moderator access to the contest'
          )
        }
        pool.query(
          `INSERT INTO contests_moderators (contest_id, moderator) VALUES (?,?)`,
          [contestId, moderatorUsername],
          (error, res) => {
            if (error || res === undefined) {
              const { code } = error
              if (code === 'ER_DUP_ENTRY') {
                return reject('The user is already a moderator')
              }
              return reject(error)
            }
            return resolve('Successfully made moderator!!')
          }
        )
      }
    )
  })
}

module.exports = addModerator
