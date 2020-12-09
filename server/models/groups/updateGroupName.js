const { pool } = require('../database')

/**
 *z
 * @param {*} param0
 * @param {Object} param0.params
 * @param {Object} param0.body
 * @param {Object} param0.username
 * @return {Promise}
 *
 */

function updateGroupName({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    const { new_group_name: newGroupName } = body
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
          return reject('Given user do not have moderator access for the group')
        }
        pool.query(
          `UPDATE \`groups\` SET group_name=? WHERE id=?`,
          [newGroupName, groupId],
          (error) => {
            if (error) {
              return reject(error)
            }
            return resolve('Group name successfully modified!')
          }
        )
      }
    )
  })
}

module.exports = updateGroupName
