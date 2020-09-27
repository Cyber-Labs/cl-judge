const nodemailer = require('nodemailer')
const dotenv = require('dotenv')

const config = dotenv.config()
if (!config) {
  console.log(config.error)
}

const mailService = process.env.MAIL_SERVICE
const senderMail = process.env.SENDER_MAIL
const senderPassword = process.env.SENDER_PASSWORD

/**
 *
 * @param {*} email
 * @param {*} subject
 * @param {*} html
 */

function sendEmail(email, subject, html) {
  const transporter = nodemailer.createTransport({
    service: mailService,
    auth: {
      user: senderMail,
      pass: senderPassword
    }
  })

  transporter.verify(error => {
    if (error) {
      console.error(error)
    }
  })

  const mailConfigurations = {
    from: senderMail,
    to: email,
    subject,
    html
  }

  transporter.sendMail(mailConfigurations, error => {
    if (error) {
      console.log(error)
      return
    }
    console.log(`Mail sent successfully!`)
  })
}

module.exports = sendEmail
