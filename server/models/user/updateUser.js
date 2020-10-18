const { pool } = require('../database')
const { sendEmail } = require('../utils')
const otplib = require('otplib')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {Object} param0.body
 * @return {Promise}
 *
 */

function updateUser({ username, body }) {
  return new Promise((resolve, reject) => {
    const secret = otplib.authenticator.generateSecret()
    const otp = otplib.authenticator.generate(secret)
    const {
      full_name: fullName,
      admission_number: admissionNumber,
      admission_year: admissionYear,
      email,
      mobile,
      department,
      course,
      bio,
    } = body
    let query = `UPDATE users SET `
    const arr = []
    //let needsChange = true;
    if (fullName) {
      query += `full_name=?,`
      arr.push(fullName)
    }
    if (admissionNumber) {
      query += `admission_number=?,`
      arr.push(admissionNumber)
    }
    if (Number.isInteger(admissionYear)) {
      query += `admission_year=?,`
      arr.push(admissionYear)
    }
    if (mobile) {
      query += `mobile=?,`
      arr.push(mobile)
    }
    if (Number.isInteger(department)) {
      query += `department=?,`
      arr.push(department)
    }
    if (Number.isInteger(course)) {
      query += `course=?,`
      arr.push(course)
    }
    if (bio) {
      query += `bio=?,`
      arr.push(bio)
    }
    if (email) {
      query += `email=?,verified=?,`
      arr.push(email)
      arr.push(0)
      query += `otp=?,otp_valid_upto=NOW()+INTERVAL 1 DAY,`
      arr.push(otp)
    }
    if (query[query.length - 1] === ',') {
      query = query.substr(0, query.length - 1)
    } else {
      reject('No update requested')
    }
    query += ` WHERE username=?`
    arr.push(username)
    pool.query(query, arr, (error) => {
      if (error) {
        return reject(error)
      }
      if (email) {
        const subject = 'Email verification'
        const port = process.env.PORT || 5000
        const host = process.env.HOST || 'localhost'
        const html = emailMessage(username, otp, host, port, email)
        sendEmail(email, subject, html)
        return resolve('User info updated. Please verify your email')
      } else {
        return resolve('User info updated')
      }
    })
  })
}

const emailMessage = (username, otp, host, port, email) => {
  return `<p>Hello ${username} !</p>
          <p>The OTP for verifying your new email is ${otp}</p>
          <p>Please verify your email by visiting the following link</p>
          <a href='http://${host}:${port}/auth/verify_new_email?email_id=${email}&username=${username}'>Verify your email</a>`
}

module.exports = updateUser
