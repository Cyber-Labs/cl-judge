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

function addMembers({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    const { members } = body
    pool.query(
      `SELECT is_group_moderator FROM user_groups WHERE username=? AND group_id=?`,
      [username, groupId],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        const { is_group_moderator } = results[0]
        if (is_group_moderator === 0) {
          return reject(`The user do not have moderator access of the group!`)
        }
        let invalidUsernames = []
        let alreadyMembers = []
        let processedUsernames = 0
        members.forEach((member) => {
          pool.query(
            `INSERT INTO user_groups (username, group_id, is_group_moderator) VALUES(?,?,0)`,
            [member, groupId],
            (error, insertResults) => {
              processedUsernames++
              if (error || insertResults === undefined) {
                if (error.code === 'ER_DUP_ENTRY') {
                  alreadyMembers.push(member)
                } else {
                  invalidUsernames.push(member)
                }
              }
              if (processedUsernames === members.length) {
                pool.query(
                  `UPDATE \`groups\` SET member_count = member_count + ? WHERE id=?`,
                  [
                    members.length -
                      invalidUsernames.length -
                      alreadyMembers.length,
                    groupId,
                  ],
                  (error) => {
                    if (error) {
                      return reject(error)
                    }
                    return resolve({
                      message: 'Added members successfully!',
                      invalidUsernames: invalidUsernames,
                      alreadyMembers: alreadyMembers,
                    })
                  }
                )
              }
            }
          )
        })
      }
    )
  })
}

module.exports = addMembers
