const ajv = require('../index')
const signupSchema = require('./signup')
const verifyEmailSchema = require('./verifyEmail')
const loginSchema = require('./login')
const forgotPassowrdSchema = require('./forgotPassword')
const resetPasswordSchema = require('./resetPassword')
const updatePasswordSchema = require('./updatePassword')

ajv.addFormat('password', data => {
  return data.length >= 8
})

module.exports = {
  signupSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPassowrdSchema,
  resetPasswordSchema,
  updatePasswordSchema
}
