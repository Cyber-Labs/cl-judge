const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 */

function getContestModerators({ username, params }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    pool.query(
      `SELECT moderator FROM contests_moderators WHERE EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) AND contest_id = ?`,
      [contestId, username, contestId],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        if (!results || !results.length) {
          return reject('The user do not have moderator access to the contest')
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getContestModerators
