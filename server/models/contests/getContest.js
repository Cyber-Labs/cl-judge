const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @return {Promise}
 */

function getContest({ username, params }) {
  return new Promise((resolve, reject) => {
    const { contest_id: contestId } = params
    pool.query(
      `SELECT id, creator, name, start_time, end_time, about, rules, prizes, participants_count FROM contests WHERE id=? 
      AND (public=1 OR EXISTS(SELECT 1 FROM contests_groups cg INNER JOIN user_groups ug ON cg.group_id = ug.group_id 
      WHERE ug.username=? AND cg.contest_id=?))`,
      [contestId, username, contestId],
      (error, results) => {
        if (error || results === undefined) {
          return reject(error)
        }
        if (!results || !results.length) {
          return reject(
            'The contest is private and user do not belongs to any eligible groups'
          )
        }
        return resolve(results)
      }
    )
  })
}

module.exports = getContest
