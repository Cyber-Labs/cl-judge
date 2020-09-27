const ajv = require('../index')
const signupSchema = require('./signup')

ajv.addFormat('password', data => {
  return data.length >= 8
})

module.exports = {
  signupSchema,
}
