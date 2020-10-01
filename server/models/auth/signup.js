/* eslint-disable no-async-promise-executor */
const bcrypt = require('bcryptjs')
const { pool } = require('../database')
const { sendEmail } = require('../utils')
const otplib = require('otplib')

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

        const secretOtp = otplib.authenticator.generateSecret()
        const otp = otplib.authenticator.generate(secretOtp)

        pool.query(
          `INSERT INTO user (username,secret,full_name,admission_number,email,mobile,otp,otp_valid_upto) 
          VALUES(?,?,?,?,?,?,?,NOW()+INTERVAL 1 DAY)`,
          [username, hash, fullName, admissionNumber, email, mobile, otp],
          error => {
            if (error) {
              return reject(error)
            }
            const subject = 'Email verification'
            const port = process.env.FRONTEND_PORT || 3000
            const host = process.env.FRONTEND_HOST || 'localhost'
            const html = emailMessage(fullName, otp, port, host, username)
            sendEmail(email, subject, html)
            return resolve(
              'Account created. Please activate your account using the OTP sent to your email address.'
            )
          }
        )
      })
    })
  })
}

const emailMessage = (fullName, otp, port, host, username) => {
  return `<p>Hello ${fullName} !</p>
          <p>The OTP for verifying your email is ${otp}</p>
          <p>Please verify your email by visiting the following link</p>
          <a href='http://${host}:${port}/auth/verify-email?username=${username}'>
            Verify your email
          </a>`
}

module.exports = signup
