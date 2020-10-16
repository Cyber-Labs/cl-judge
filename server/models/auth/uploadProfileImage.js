const { pool } = require('../database')

function uploadProfileImage(req) {
  return new Promise((resolve, reject) => {
    if (!req.file) {
      return reject('File not uploaded')
    } else {
      const results = { profileImg: req.file.path }
      pool.query(
        'UPDATE user SET profile_img=? WHERE username=?',
        [results.profileImg, req.username],
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
