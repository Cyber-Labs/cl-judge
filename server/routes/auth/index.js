const signupRouter = require('./signup')
const verifyEmailRouter = require('./verifyEmail')
const loginRouter = require('./login')
const forgotPasswordRouter = require('./forgotPassword')
const resetPassowrdRouter = require('./resetPassword')
const updatePasswordRouter = require('./updatePassword')
const updateUserRouter = require('./updateUser')
const verifyNewEmailRouter = require('./verifyNewEmail')
const getUserRouter = require('./getUser')
const uploadProfileImage = require('./uploadProfileImage')

module.exports = {
  signupRouter,
  verifyEmailRouter,
  loginRouter,
  forgotPasswordRouter,
  resetPassowrdRouter,
  updatePasswordRouter,
  updateUserRouter,
  verifyNewEmailRouter,
  getUserRouter,
  uploadProfileImage,
}
