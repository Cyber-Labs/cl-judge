const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Object} param0.params
 * @param {Object} param0.body
 * @param {Object} param0.username
 * @return {Promise}
 *
 */

function removeBranch({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    const { department, course, admission_year: admissionYear } = body
    pool.query(
      `SELECT is_group_moderator FROM user_groups WHERE username=? AND group_id=?`,
      [username, groupId],
      (error, results) => {
        if (error) {
          return reject(error)
        } else if (!results || !results.length) {
          return reject('Invalid Group ID')
        }
        const { is_group_moderator } = results[0]
        if (is_group_moderator === 0) {
          return reject(`The user do not have moderator access of the group!`)
        }
        pool.query(
          `SELECT username FROM users WHERE department=? AND course=? AND admission_year=?`,
          [department, course, admissionYear],
          (error, results) => {
            if (error) {
              return reject(error)
            }
            let processedUsernames = 0
            let alreadyNotMembers = []
            results.forEach((member) => {
              pool.query(
                `DELETE FROM user_groups WHERE username=? AND group_id=?`,
                [member.username, groupId],
                (error, deleteResults) => {
                  processedUsernames++
                  if (
                    error ||
                    deleteResults === undefined ||
                    deleteResults.affectedRows === 0
                  ) {
                    alreadyNotMembers.push(member.username)
                  }
                  if (processedUsernames === results.length) {
                    pool.query(
                      `UPDATE \`groups\` SET member_count = member_count - ? WHERE id=?`,
                      [results.length - alreadyNotMembers.length, groupId],
                      (error) => {
                        if (error) {
                          return reject(error)
                        }
                        return resolve({
                          message: 'Branch removed successfully!',
                          alreadyNotMembers: alreadyNotMembers,
                        })
                      }
                    )
                  }
                }
              )
            })
          }
        )
      }
    )
  })
}

module.exports = removeBranch
