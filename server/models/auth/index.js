const signup = require('./signup')
const verifyEmail = require('./verifyEmail')
const login = require('./login')
const forgotPassword = require('./forgotPassword')
const resetPassword = require('./resetPassword')
const updatePassword = require('./updatePassword')
const updateUser = require('./updateUser')
const verifyNewEmail = require('./verifyNewEmail')
const getUser = require('./getUser')

module.exports = {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateUser,
  verifyNewEmail,
  getUser,
}
