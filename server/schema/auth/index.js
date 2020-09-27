const ajv = require('../index')
const signupSchema = require('./signup')
const verifyEmailSchema = require('./verifyEmail')

ajv.addFormat('password', data => {
  return data.length >= 8
})

module.exports = {
  signupSchema,
  verifyEmailSchema
}
