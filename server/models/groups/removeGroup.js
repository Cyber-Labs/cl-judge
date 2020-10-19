const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.body
 * @return {Promise}
 *
 */

function removeGroup({ username, params }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params

    pool.query(
      `SELECT creator FROM \`groups\` WHERE id=?`,
      [groupId],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        const { creator } = results[0]
        if (creator !== username) {
          return reject('The given user is not a creator of the group!')
        }
      }
    )
    pool.query(`DELETE FROM \`groups\` WHERE id=?`, [groupId], (error) => {
      if (error) {
        return reject(error)
      }
    })
    return resolve('Group removed successfully')
  })
}

module.exports = removeGroup
