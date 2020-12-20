const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 *
 */

function getAllParticipants({ username, params }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    pool.query(
      `SELECT participant FROM contests_participants WHERE EXISTS(SELECT 1 FROM contests_participants WHERE contest_id=? AND participant=?) AND contest_id = ?`,
      [contestId, username, contestId],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        if (!results.length) {
          return reject(
            'Either the contest ID is invalid or you have not yet registered for the contest'
          )
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getAllParticipants
