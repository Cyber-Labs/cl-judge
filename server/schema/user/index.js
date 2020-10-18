const ajv = require('../index')
const updatePasswordSchema = require('./updatePassword')
const updateUserSchema = require('./updateUser')

ajv.addFormat('password', (data) => {
  return data.length >= 8
})

module.exports = {
  updatePasswordSchema,
  updateUserSchema,
}
