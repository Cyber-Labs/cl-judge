const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function removeGroup({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { group_id: groupId } = body
    pool.query(
      `DELETE FROM contests_groups WHERE (SELECT COUNT(id) FROM contests_moderators WHERE contest_id=? AND moderator=?) AND contest_id=? AND group_id=?`,
      [contestId, username, contestId, groupId],
      (error, res) => {
        if (error || res === undefined) {
          return reject(error)
        }
        const { affectedRows } = res
        if (affectedRows === 0) {
          return reject(
            'Either the group is not a part of the contest or you do not have the required permissions'
          )
        }
        return resolve('Successfully removed group')
      }
    )
  })
}

module.exports = removeGroup
