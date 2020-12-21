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

function removeBranch({ params, body, username }) {
  return new Promise((resolve, reject) => {
    const { group_id: groupId } = params
    const { department, course, admission_year: admissionYear } = body
    pool.getConnection((error, connection) => {
      if (error) {
        return reject(error)
      }
      connection.beginTransaction((error) => {
        if (error) {
          return connection.rollback(() => {
            connection.release()
            return reject(error)
          })
        }
        connection.query(
          `DELETE FROM user_groups WHERE group_id=? 
       AND username in (SELECT username FROM users WHERE department=? AND course=? AND admission_year=?) 
       AND EXISTS(SELECT 1 FROM (SELECT 1 FROM user_groups WHERE username=? AND group_id=? AND is_group_moderator=1) a)`,
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
                  'Either you do not have moderator access of the group or there is no group member with this branch'
                )
              })
            }
            connection.query(
              `UPDATE \`groups\` SET member_count = member_count-? WHERE id=?`,
              [affectedRows, groupId],
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
                    message: 'Branch removed successfully!',
                    membersRemoved: affectedRows,
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

module.exports = removeBranch
