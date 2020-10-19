const { pool } = require('../database')

/**
 *z
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.body
 * @return {Promise}
 *
 */

function createGroup({ username, body }) {
  return new Promise((resolve, reject) => {
    const { group_name: groupName, confidential, members } = body
    pool.query(
      `INSERT INTO cl_judge.groups (group_name,creator,confidential,member_count)
        VALUES(?,?,?,?)`,
      [groupName, username, confidential, members.length],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        const { insertId } = results
        pool.query(
          `INSERT INTO cl_judge.user_groups (username,group_id,is_group_moderator) VALUES(?,?,?)`,
          [username, insertId, 1],
          (error) => {
            if (error) {
              return reject(error)
            }
          }
        )
        members.forEach((member) => {
          pool.query(
            `INSERT INTO cl_judge.user_groups (username,group_id,is_group_moderator) VALUES(?,?,?)`,
            [member, insertId, 0],
            (error) => {
              if (error) {
                return reject(error)
              }
            }
          )
        })
        return resolve({
          message: 'Group created successfully',
          groupId: insertId,
        })
      }
    )
  })
}

module.exports = createGroup
