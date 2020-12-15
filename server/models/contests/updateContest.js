const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Object} param0.body
 * @param {Object} param0.params
 * @param {String} param0.username
 * @return {Promise}
 *
 */

function updateContest({ body, params, username }) {
  return new Promise((resolve, reject) => {
    const {
      name,
      show_leaderboard: showLeaderboard,
      public,
      start_time: startTime,
      end_time: endTime,
      about,
      rules,
      prizes,
      confidential_questions: confidentialQuestions,
    } = body
    const { contest_id: contestId } = params
    let query = `UPDATE contests SET `
    let arr = []
    if (name) {
      query += `name=?,`
      arr.push(name)
    }
    if (showLeaderboard !== undefined) {
      query += `show_leaderboard=?,`
      arr.push(showLeaderboard)
    }
    if (public !== undefined) {
      query += `public=?,`
      arr.push(public)
    }
    if (startTime && !isNaN(Date.parse(startTime))) {
      query += `start_time=?,`
      arr.push(new Date(startTime))
    }
    if (endTime && !isNaN(Date.parse(endTime))) {
      query += `end_time=?,`
      arr.push(new Date(endTime))
    }
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
    if (confidentialQuestions !== undefined) {
      query += `confidential_questions=?,`
      arr.push(confidentialQuestions)
    }

    if (query[query.length - 1] === ',') {
      query = query.substr(0, query.length - 1)
    } else {
      return reject('Contest is already upto date')
    }
    query += ` WHERE (SELECT COUNT(id) FROM contests_moderators WHERE contest_id=? AND moderator=? )AND id=?`
    arr.push(contestId, username, contestId)
    pool.query(query, arr, (error, res) => {
      if (error || res === undefined) {
        return reject(error)
      }
      return resolve('Contest updated successfully')
    })
  })
}

module.exports = updateContest
