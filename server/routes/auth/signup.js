const express = require('express')
const router = express.Router()
const auth = require('../../models/auth')
const ajv = require('../../schema')
const { signupSchema } = require('../../schema/auth')

/**
 *
 * @param {Array} errArray
 * @return {String}
 */
function sumErrors(errArray) {
  const cb = (a, b) => a + b.message + ', '
  return errArray.reduce(cb, '')
}

router.post('/signup', async (request, response) => {
  const validate = ajv.compile(signupSchema)
  const isValid = validate(request.body)
  if (!isValid) {
    return response.status(400).json({
      success: false,
      error: sumErrors(validate.errors),
      results: null,
    })
  }
  auth
    .signup(request.body)
    .then((results) => {
      return response.status(200).json({
        success: true,
        error: null,
        results,
      })
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        error,
        results: null,
      })
    })
})

module.exports = router
