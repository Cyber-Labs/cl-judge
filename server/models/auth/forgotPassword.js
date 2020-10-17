/* eslint-disable no-async-promise-executor */
const { sendEmail } = require('../utils')
const otplib = require('otplib')
const { pool } = require('../database')

/**
 *
 * @param {*} param0
 * @param {String} param0.email
 * @return {Promise}
 */

function forgotPassword({ email }) {
  return new Promise(async (resolve, reject) => {
    const secret = otplib.authenticator.generateSecret()
    const otp = otplib.authenticator.generate(secret)
    const subject = 'Forgot Password'
    const port = process.env.FRONTEND_PORT || 3000
    const host = process.env.FRONTEND_HOST || 'localhost'
    const html = emailMessage(otp, host, port)
    sendEmail(email, subject, html)

    pool.query(
      `SELECT verified FROM users WHERE email=?`,
      [email],
      (error, results) => {
        if (error) {
          return reject(error)
        }
        if (!results.length) {
          return reject('No account exists with the given email!')
        }
        const { verified } = results[0]
        if (verified !== 1) {
          return reject(
            'The account with this email is not verified yet, please verify your email account first!'
          )
        }
      }
    )
    pool.query(
      `UPDATE users SET otp=?,otp_valid_upto=NOW()+INTERVAL 1 DAY WHERE email=?`,
      [otp, email],
      (error) => {
        if (error) {
          return reject(error)
        }
        return resolve('Please reset your password from the email received')
      }
    )
  })
}

const emailMessage = (otp, host, port) => {
  return `<p>Hello !</p>
          <p>The otp for resetting your password is ${otp}</p>
          <p>Please reset your password by visiting the following link</p>
          <a href='http://${host}:${port}/auth/reset-password'>Reset password</a>`
}

module.exports = forgotPassword
