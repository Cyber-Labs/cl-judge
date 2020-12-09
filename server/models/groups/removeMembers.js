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

function removeMembers({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    const { members } = body
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
          `SELECT creator FROM \`groups\` WHERE id=?`,
          [groupId],
          (error, res) => {
            if (error) {
              return reject(error)
            }
            const { creator } = res[0]
            let invalidUsernames = []
            let processedUsernames = 0
            members.forEach((member) => {
              pool.query(
                `DELETE FROM user_groups WHERE username=? AND group_id=? AND username NOT IN (?)`,
                [member, groupId, creator],
                (error, deleteResults) => {
                  processedUsernames++
                  if (
                    error ||
                    deleteResults === undefined ||
                    deleteResults.affectedRows === 0
                  ) {
                    invalidUsernames.push(member)
                  }
                  if (processedUsernames === members.length) {
                    pool.query(
                      `UPDATE \`groups\` SET member_count = member_count - ? WHERE id=?`,
                      [members.length - invalidUsernames.length, groupId],
                      (error) => {
                        if (error) {
                          return reject(error)
                        }
                        return resolve({
                          message: 'Removed members successfully!',
                          invalidUsernames: invalidUsernames,
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

module.exports = removeMembers
