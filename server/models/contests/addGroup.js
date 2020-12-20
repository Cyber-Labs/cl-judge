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
      `INSERT INTO contests_groups (contest_id, group_id) SELECT contest_id, ? FROM contests_moderators WHERE contest_id=? AND moderator=?
      AND EXISTS(SELECT 1 FROM user_groups WHERE group_id=? AND username=? AND is_group_moderator=1)`,
      [groupId, contestId, username, groupId, username],
      (error, res) => {
        if (error || res === undefined) {
          const { code } = error
          if (code === 'ER_DUP_ENTRY') {
            return reject('The group is already added')
          }
          return reject(error)
        } else {
          const { affectedRows } = res
          if (!affectedRows) {
            return reject(
              'The user do not have moderator access of the contest or the group'
            )
          }
          return resolve('Successfully added group')
        }
      }
    )
  })
}

module.exports = addGroup
