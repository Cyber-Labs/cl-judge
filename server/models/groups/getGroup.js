const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 *
 */

function getGroup({ username, params }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    pool.query(
      `SELECT user_groups.is_group_moderator, \`groups\`.confidential FROM user_groups 
      INNER JOIN \`groups\` ON  user_groups.group_id = \`groups\`.id
      WHERE user_groups.group_id=? AND user_groups.username=?`,
      [groupId, username],
      (error, results) => {
        if (error) {
          return reject(error)
        } else if (!results || !results.length) {
          return reject('Invalid Group ID')
        }
        const { is_group_moderator, confidential } = results[0]
        if (is_group_moderator === 0 && confidential === 1) {
          return reject(
            'The group is confidential and user do not have moderator access!'
          )
        }
        pool.query(
          `SELECT users.username, users.full_name, users.admission_number, users.profile_img, users.email, users.course, users.department, 
          user_groups.is_group_moderator FROM user_groups 
          INNER JOIN users ON user_groups.username = users.username
          WHERE user_groups.group_id=? ORDER BY users.admission_number`,
          [groupId],
          (error, members) => {
            if (error) {
              return reject(error)
            }
            pool.query(
              `SELECT creator, group_name, confidential FROM \`groups\` WHERE id=?`,
              [groupId],
              (error, results) => {
                if (error) {
                  return reject(error)
                }
                return resolve({ ...results[0], members })
              }
            )
          }
        )
      }
    )
  })
}

module.exports = getGroup
