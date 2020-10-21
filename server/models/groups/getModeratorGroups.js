const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @return {Promise}
 */

function getModeratorGroups({ username }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id,creator,group_name,member_count,confidential FROM \`groups\` 
      WHERE id in (SELECT group_id FROM user_groups WHERE username=? AND is_group_moderator=1)`,
      [username],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getModeratorGroups
