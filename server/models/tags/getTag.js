const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Object} param0.query
 * @return {Promise}
 */

function getTag({ query }) {
  return new Promise((resolve, reject) => {
    const keyword = query.keyword || ''
    const searchId = query.id || ''
    let poolQuery = ''
    let arr = []
    if (searchId && searchId !== '') {
      poolQuery += `SELECT * FROM tags WHERE id = ?`
      arr.push(searchId)
    } else if (keyword && keyword !== '') {
      poolQuery += `SELECT * FROM tags WHERE name LIKE ?`
      arr.push(`%${keyword}%`)
    } else {
      poolQuery += `SELECT * FROM tags`
    }
    pool.query(poolQuery, arr, (error, results) => {
      if (error || results === undefined) {
        return reject(error)
      }
      return resolve(results)
    })
  })
}

module.exports = getTag
