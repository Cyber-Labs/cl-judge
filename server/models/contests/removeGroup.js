const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @return {Promise}
 */

function removeGroup({ params, body }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    const { group_id: groupId } = body
    pool.query(
      `DELETE FROM contests_groups WHERE contest_id=? AND group_id=?`,
      [contestId, groupId],
      (error, res) => {
        if (error || res === undefined) {
          return reject(error)
        }
        const { affectedRows } = res
        if (affectedRows === 0) {
          return reject('The group is not a part of the contest')
        }
        return resolve('Successfully removed group')
      }
    )
  })
}

module.exports = removeGroup
