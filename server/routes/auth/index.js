const signupRouter = require('./signup')
const verifyEmailRouter = require('./verifyEmail')
const loginRouter = require('./login')
const forgotPasswordRouter = require('./forgotPassword')
const resetPassowrdRouter = require('./resetPassword')
const updatePasswordRouter = require('./updatePassword')

module.exports = {
  signupRouter,
  verifyEmailRouter,
  loginRouter,
  forgotPasswordRouter,
  resetPassowrdRouter,
  updatePasswordRouter
}
