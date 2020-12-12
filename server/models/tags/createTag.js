const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {Object} param0.body
 * @return {Promise}
 */

function createTag({ body }) {
  return new Promise((resolve, reject) => {
    const { name } = body
    const description = body.description || null
    pool.query(
      `INSERT INTO tags (name, description) VALUES (?, ?)`,
      [name, description],
      (error, results) => {
        if (error && error.code === 'ER_DUP_ENTRY') {
          reject('Tag with this name already exists')
        } else if (error || results === undefined) {
          return reject(error)
        }
        return resolve('Tag successfully added')
      }
    )
  })
}

module.exports = createTag
