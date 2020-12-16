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
      INNER JOIN  contests_participants ON users.username=contests_participants.participant 
      WHERE EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) AND contest_id=?`,
      [contestId, username, contestId],
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
