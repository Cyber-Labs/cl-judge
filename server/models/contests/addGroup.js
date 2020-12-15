const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @return {Promise}
 */

function addGroup({ params, body }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { group_id: groupId } = body
    pool.query(
      `INSERT INTO contests_groups (contest_id, group_id) SELECT contest_id, ? FROM contest_moderators WHERE contest_id=? AND moderator=?`,
      [contestId, groupId],
      (error, res) => {
        if (error || res === undefined) {
          const { code } = error
          if (code === 'ER_DUP_ENTRY') {
            return reject('The group is already added')
          }
          return reject(error)
        }
        return resolve('Successfully added group')
      }
    )
  })
}

module.exports = addGroup
