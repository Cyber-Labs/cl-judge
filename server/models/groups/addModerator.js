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

function addModerator({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    const { moderator_username: moderatorUsername } = body
    pool.query(
      `SELECT is_group_moderator FROM user_groups WHERE group_id=? AND username=?`,
      [groupId, username],
      (error, results) => {
        if (error) {
          return reject(error)
        } else if (!results || !results.length) {
          return reject('Invalid Group ID')
        }
        const { is_group_moderator } = results[0]
        if (is_group_moderator === 0) {
          return reject('You do not have moderator access for the group')
        }
        pool.query(
          `SELECT creator FROM \`groups\` WHERE id=?`,
          [groupId],
          (error, results) => {
            if (error) {
              return reject(error)
            }
            const { creator } = results[0]
            if (creator === moderatorUsername) {
              return reject(
                'Moderator access of the creator can not be changed'
              )
            }
            pool.query(
              `UPDATE user_groups SET is_group_moderator=? WHERE group_id=? AND username=? AND is_group_moderator=?`,
              [1, groupId, moderatorUsername, 0],
              (error, results) => {
                if (error) {
                  return reject(error)
                }
                if (results === undefined || results.affectedRows === 0) {
                  return reject(
                    'Either the person is already a moderator or no such username found in the group!'
                  )
                }
                return resolve('Successfully made moderator!!')
              }
            )
          }
        )
      }
    )
  })
}

module.exports = addModerator
