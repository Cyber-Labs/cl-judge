const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Object} param0.params
 * @param {Object} param0.body
 * @param {Object} param0.username
 * @return {Promise}
 *
 */

function addBranch({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    const { department, course, admission_year: admissionYear } = body
    pool.getConnection((error, connection) => {
      if (error) {
        return reject(error)
      }
      connection.beginTransaction((error) => {
        if (error) {
          connection.release()
          return reject(error)
        }
        connection.query(
          `INSERT INTO user_groups (username, group_id, is_group_moderator)
       SELECT username,?,0 FROM users WHERE department=? AND course=? AND admission_year=?
       AND EXISTS(SELECT 1 FROM user_groups WHERE username=? AND group_id=? AND is_group_moderator=1)
       ON DUPLICATE KEY UPDATE group_id=group_id`,
          [groupId, department, course, admissionYear, username, groupId],
          (error, results) => {
            if (error) {
              return connection.rollback(() => {
                connection.release()
                return reject(error)
              })
            }
            const { affectedRows } = results
            if (!affectedRows) {
              return connection.rollback(() => {
                connection.release()
                return reject(
                  'Either you do not have moderator access of the group or there is no user with this branch'
                )
              })
            }
            connection.query(
              `UPDATE \`groups\` SET member_count = (SELECT COUNT(username) FROM user_groups WHERE group_id=?) WHERE id=?`,
              [groupId, groupId],
              (error) => {
                if (error) {
                  return connection.rollback(() => {
                    connection.release()
                    return reject(error)
                  })
                }
                connection.commit((error) => {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release()
                      return reject(error)
                    })
                  }
                  connection.release()
                  return resolve({
                    message: 'Branch added successfully!',
                    branchMembersCount: affectedRows,
                  })
                })
              }
            )
          }
        )
      })
    })
  })
}

module.exports = addBranch
