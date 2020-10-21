const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.body
 * @return {Promise}
 *
 */

function createGroup({ username, body }) {
  return new Promise((resolve, reject) => {
    const { group_name: groupName, confidential, members } = body
    let currentId
    pool.query(
      `INSERT INTO \`groups\` (group_name,creator,confidential,member_count) VALUES(?,?,?,?)`,
      [groupName, username, confidential, 0],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        const { insertId } = results
        currentId = insertId
        pool.query(
          `INSERT INTO user_groups (username,group_id,is_group_moderator) VALUES(?,?,?)`,
          [username, currentId, 1],
          (error) => {
            if (error) {
              return reject(error)
            }
            let invalidUsernames = []
            let processedUsernames = 0
            members.forEach((member) => {
              pool.query(
                `INSERT INTO user_groups (username,group_id,is_group_moderator) VALUES(?,?,?)`,
                [member, currentId, 0],
                (error, results) => {
                  if (error || results === undefined) {
                    invalidUsernames.push(member)
                  }
                  processedUsernames++
                  if (processedUsernames == members.length) {
                    pool.query(
                      `UPDATE \`groups\` SET member_count=? WHERE id=?`,
                      [members.length - invalidUsernames.length + 1, currentId],
                      (error) => {
                        if (error) {
                          return reject(error)
                        }
                        return resolve({
                          message: 'Group created successfully!!',
                          groupId: currentId,
                          invalidMembers: invalidUsernames,
                        })
                      }
                    )
                  }
                }
              )
            })
          }
        )
      }
    )
  })
}

module.exports = createGroup
