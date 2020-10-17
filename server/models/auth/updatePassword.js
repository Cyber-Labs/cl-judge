/* eslint-disable no-async-promise-executor */
const { pool } = require('../database')
const bcrypt = require('bcryptjs')
const isCorrect = require('./isCorrect')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.body
 * @return {Promise}
 */

function updatePassword({ username, body }) {
  return new Promise(async (resolve, reject) => {
    let ans
    const { password, new_password: newPassword } = body
    try {
      ans = await isCorrect(username, password)
    } catch (error) {
      return reject(error)
    }
    if (ans) {
      bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (error, salt) => {
        if (error) {
          return reject(error)
        }
        bcrypt.hash(newPassword, salt, (error, hash) => {
          if (error) {
            return reject(error)
          }
          pool.query(
            `UPDATE user SET secret=? WHERE username=?`,
            [hash, username],
            (error) => {
              if (error) {
                return reject(error)
              }
              return resolve('Password updated')
            }
          )
        })
      })
    } else {
      return reject('Password incorrect')
    }
  })
}

module.exports = updatePassword
