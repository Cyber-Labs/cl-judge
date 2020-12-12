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
    let currentId
    pool.query(
      `INSERT INTO contests (creator, name, show_leaderboard, public, start_time, end_time, participants_count) VALUES (?,?,?,?,?,?,?)`,
      [username, name, showLeaderboard, public, startTime, endTime, 0],
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
            const {
              about,
              rules,
              prizes,
              confidential_questions: confidentialQuestions,
            } = body
            let query = `UPDATE contests SET `
            let arr = []
            if (about) {
              query += `about=?,`
              arr.push(about)
            }
            if (rules) {
              query += `rules=?,`
              arr.push(rules)
            }
            if (prizes) {
              query += `prizes=?,`
              arr.push(prizes)
            }
            if (confidentialQuestions) {
              query += `confidential_questions=?,`
              arr.push(confidentialQuestions)
            }

            if (query[query.length - 1] === ',') {
              query = query.substr(0, query.length - 1)
            } else {
              return resolve({
                message: 'Contest created successfully',
                contestId: currentId,
              })
            }
            query += ` WHERE id=?`
            arr.push(currentId)
            pool.query(query, arr, (error, res) => {
              if (error || res === undefined) {
                return reject(error)
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
}

module.exports = createContest
