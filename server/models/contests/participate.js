const { pool } = require('../database')

/**
 * @param {*} param0
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 */

function participate({ params, username }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
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
          `INSERT INTO contests_participants (contest_id, participant) SELECT ?, ? 
          WHERE EXISTS(SELECT 1 FROM user_groups WHERE username=? AND group_id = ANY (SELECT group_id FROM contests_groups WHERE contest_id=?))`,
          [contestId, username, username, contestId],
          (error, res) => {
            if (error || res === undefined) {
              return connection.rollback(() => {
                connection.release()
                const { code } = error
                if (code === 'ER_DUP_ENTRY') {
                  return reject('The user is already a participant')
                }
                return reject(error)
              })
            }
            const { affectedRows } = res
            if (!affectedRows) {
              return connection.rollback(() => {
                connection.release()
                return reject(
                  'None of the groups user is in are eligible for the contest'
                )
              })
            }
            connection.query(
              `UPDATE contests SET participants_count = participants_count + 1 WHERE id=?`,
              [contestId],
              (error, updateResults) => {
                if (error || updateResults === undefined) {
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
                  return resolve(
                    'The user successfully registered for the contest'
                  )
                })
              }
            )
          }
        )
      })
    })
  })
}

module.exports = participate
