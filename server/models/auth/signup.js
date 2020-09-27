/* eslint-disable no-async-promise-executor */
const bcrypt = require('bcryptjs')
const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.password
 * @param {String} param0.full_name
 * @param {String} param0.admission_number
 * @param {String} param0.email
 * @param {String} param0.mobile
 * @return {Promise}
 *
 */

function signup({
  username,
  password,
  full_name: fullName,
  admission_number: admissionNumber,
  email,
  mobile
}) {
  return new Promise(async (resolve, reject) => {
    bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS), (error, salt) => {
      if (error) {
        return reject(error)
      }
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          return reject(error)
        }
        pool.query(
          `INSERT INTO user (username,secret,full_name,admission_number,email,mobile) VALUES(?,?,?,?,?,?)`,
          [username, hash, fullName, admissionNumber, email, mobile],
          error => {
            if (error) {
              return reject(error)
            }
            return resolve(
              'Account created. Please activate your account using the OTP sent to your email address.'
            )
          }
        )
      })
    })
  })
}

module.exports = signup
