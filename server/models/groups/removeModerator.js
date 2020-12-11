const { pool } = require('../database')
const notifications = require('../notifications')
/**
 *
 * @param {*} param0
 * @param {Object} param0.params
 * @param {Object} param0.body
 * @param {Object} param0.username
 * @return {Promise}
 *
 */

function removeModerator({ params, body, username }) {
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
          return reject('Given user do not have moderator access for the group')
        }
        pool.query(
          `SELECT creator, group_name  FROM \`groups\` WHERE id=?`,
          [groupId],
          (error, results) => {
            if (error) {
              return reject(error)
            }
            const { creator, group_name: groupName } = results[0]
            if (creator === moderatorUsername) {
              return reject(
                'Moderator access of the creator can not be changed'
              )
            }
            pool.query(
              `UPDATE user_groups SET is_group_moderator=? WHERE group_id=? AND username=? AND is_group_moderator=?`,
              [0, groupId, moderatorUsername, 1],
              (error, results) => {
                if (error) {
                  return reject(error)
                }
                if (results === undefined || results.affectedRows === 0) {
                  return reject(
                    'Either the person is already not a moderator or no such person found in the group!'
                  )
                }
                const port = process.env.FRONTEND_PORT || 3000
                const host = process.env.FRONTEND_HOST || 'localhost'
                const body = {
                  heading: `Removed from moderator of ${groupName}`,
                  description: `You are no longer a moderator of the group [${groupName}](http://${host}:${port}/groups/${groupId})`,
                  public: false,
                  target_usernames: [moderatorUsername],
                }
                const notification = {
                  username: process.env.MANAGER_USERNAME,
                  body,
                }
                notifications.createNotification(notification).then(() => {
                  return resolve('Successfully removed from moderator!!')
                })
              }
            )
          }
        )
      }
    )
  })
}

module.exports = removeModerator
