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
    pool.query(
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
          return reject(error)
        }
        const { insertId } = results
        currentId = insertId
        pool.query(
          `INSERT INTO contests_moderators (contest_id, moderator) VALUES (?,?)`,
          [currentId, username],
          (error, res) => {
            if (error || res === undefined) {
              return reject(error)
            }
            return resolve({
              message: 'Contest created successfully',
              contestId: currentId,
            })
          }
        )
      }
    )
  })
}

module.exports = createContest
