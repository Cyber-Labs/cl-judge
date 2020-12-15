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
      `SELECT participant FROM contests_participants WHERE contest_id = (SELECT contest_id FROM contests_participants WHERE contest_id=? AND participant=?)`,
      [contestId, username],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        if (!results.length) {
          return reject(
            'Only a participant is allowed to see all participants of the contest'
          )
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getAllParticipants
