const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.file
 * @param {String} param0.username
 * @return {Promise}
 *
 */

function uploadProfileImage({ file, username }) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject('File not uploaded')
    } else {
      const results = { profileImg: file.path }
      pool.query(
        'UPDATE user SET profile_img=? WHERE username=?',
        [results.profileImg, username],
        (error) => {
          if (error) {
            return reject(error)
          }
          return resolve(results)
        }
      )
    }
  })
}

module.exports = uploadProfileImage
