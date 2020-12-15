const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function addModerator({ params, body }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { moderator: moderatorUsername } = body
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
  })
}

module.exports = addModerator
