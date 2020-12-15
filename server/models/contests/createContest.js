const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.body
 * @return {Promise}
 *
 */

function createContest({ username, body }) {
  return new Promise((resolve, reject) => {
    const {
      name,
      show_leaderboard: showLeaderboard,
      public,
      start_time,
      end_time,
    } = body
    const startTime = new Date(start_time)
    const endTime = new Date(end_time)
    let about = body.about || null
    let rules = body.rules || null
    let prizes = body.prizes || null
    let confidentialQuestions = body.confidential_questions || null
    let currentId
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
          `INSERT INTO contests (creator, name, show_leaderboard, public, start_time, end_time, about, rules, prizes, confidential_questions) VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            username,
            name,
            showLeaderboard,
            public,
            startTime,
            endTime,
            about,
            rules,
            prizes,
            confidentialQuestions,
          ],
          (error, results) => {
            if (error || results === undefined) {
              return connection.rollback(() => {
                connection.release()
                return reject(error)
              })
            }
            const { insertId } = results
            currentId = insertId
            connection.query(
              `INSERT INTO contests_moderators (contest_id, moderator) VALUES (?,?)`,
              [currentId, username],
              (error, insertionResults) => {
                if (error || insertionResults === undefined) {
                  return connection.rollback(() => {
                    return reject(error)
                  })
                }
                connection.commit((error) => {
                  if (error) {
                    return connection.rollback(() => {
                      return reject(error)
                    })
                  }
                  return resolve({
                    message: 'Contest created successfully',
                    contestId: currentId,
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

module.exports = createContest
