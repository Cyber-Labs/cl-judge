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
          connection.release()
          return reject(error)
        }
        connection.query(
          `INSERT INTO contests_participants (contest_id, participant) SELECT ?, ? 
          WHERE (EXISTS(SELECT 1 FROM user_groups ug INNER JOIN contests_groups cg ON ug.group_id = cg.group_id WHERE ug.username=? AND cg.contest_id=?) 
          OR EXISTS(SELECT 1 FROM contests WHERE id=? AND public=1))
          AND EXISTS(SELECT 1 FROM contests WHERE id=? AND NOW()<=end_time)`,
          [contestId, username, username, contestId, contestId, contestId],
          (error, res) => {
            if (error || res === undefined) {
              return connection.rollback(() => {
                connection.release()
                const { code } = error
                if (code === 'ER_DUP_ENTRY') {
                  return reject('You have already registered for this contest')
                }
                return reject(error)
              })
            }
            const { affectedRows } = res
            if (!affectedRows) {
              return connection.rollback(() => {
                connection.release()
                return reject(
                  'You are not eligible to register for the contest'
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
