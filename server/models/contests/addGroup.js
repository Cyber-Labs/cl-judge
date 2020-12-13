const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function addGroup({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { group_id: groupId } = body
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
          `INSERT INTO contests_groups (contest_id, group_id) VALUES (?,?)`,
          [contestId, groupId],
          (error, res) => {
            if (error || res === undefined) {
              const { code } = error
              if (code === 'ER_DUP_ENTRY') {
                return reject('The group is already added')
              }
              return reject(error)
            }
            return resolve('Successfully added group')
          }
        )
      }
    )
  })
}

module.exports = addGroup
