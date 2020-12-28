const { pool } = require('../../models/database')

/**
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.params
 * @param {Object} param0.query
 * @return {Promise}
 */

function getContestDetails({ username, params, query }) {
  return new Promise((resolve, reject) => {
    const onlyName = query.only_name || false
    const { contest_id: contestId } = params
    let sqlQuery = `SELECT * from contests WHERE EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) AND id=?`
    if (onlyName) {
      sqlQuery = `SELECT name,creator from contests WHERE EXISTS(SELECT 1 FROM contests_moderators WHERE contest_id=? AND moderator=?) AND id=?`
    }
    pool.query(sqlQuery, [contestId, username, contestId], (error, results) => {
      if (error || results === undefined) {
        return reject(error)
      }
      if (!results.length) {
        return reject(
          'Invalid contest Id or the user do not have required permissions'
        )
      }
      if (onlyName) {
        return resolve(results[0])
      }
      pool.query(
        `SELECT group_id, group_name, member_count FROM \`groups\` g INNER JOIN contests_groups cg
      ON g.id=cg.group_id WHERE cg.contest_id=?`,
        [contestId],
        (error, eligibleGroups) => {
          if (error) {
            return reject(error)
          }
          return resolve({ ...results[0], eligible_groups: eligibleGroups })
        }
      )
    })
  })
}

module.exports = getContestDetails
