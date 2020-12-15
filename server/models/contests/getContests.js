/* eslint-disable no-async-promise-executor */
const { pool } = require('../../models/database')
const { sortContests } = require('../utils')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.query
 * @return {Promise}
 */

function getContest({ username, query }) {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM contests WHERE (public=1 OR id IN (SELECT contest_id FROM contests_participants WHERE participant=?)) ORDER BY end_time`,
      [username],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        const sortedResults = sortContests(results, query)
        if (sortedResults) {
          return resolve(sortedResults)
        }
        return reject('Something went wrong')
      }
    )
  })
}

module.exports = getContest
