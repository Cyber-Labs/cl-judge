const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function removeModerator({ params, body, username }) {
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
          `DELETE FROM contests_moderators WHERE contest_id=? AND moderator=? 
                    AND moderator NOT IN (SELECT creator FROM contests WHERE contest_id=?)`,
          [contestId, moderatorUsername, contestId],
          (error, res) => {
            if (error || res === undefined) {
              return reject(error)
            }
            const { affectedRows } = res
            if (affectedRows === 0) {
              return reject('Either user was a creator or not a moderator')
            }
            return resolve('Successfully removed as moderator')
          }
        )
      }
    )
  })
}

module.exports = removeModerator
