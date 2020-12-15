const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 *
 */

function getAllParticipantsDetails({ username, params }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    pool.query(
      `SELECT username, full_name, admission_number, email, mobile, department, course, admission_year, profile_img FROM users 
        WHERE username = ANY (SELECT participant FROM contests_participants WHERE contest_id=?) 
        AND (SELECT COUNT(id) FROM contests_moderators WHERE contest_id=? AND moderator=?)`,
      [contestId, contestId, username],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        if (!results.length) {
          return reject(
            'Either no one has yet participated or the user do not have required permissions'
          )
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getAllParticipantsDetails
