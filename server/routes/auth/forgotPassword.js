const express = require('express')
const router = express.Router()
const auth = require('../../models/auth')
const ajv = require('../../schema')
const { forgotPassowrdSchema } = require('../../schema/auth')

/**
 *
 * @param {Array} errArray
 * @return {String}
 */
function sumErrors(errArray) {
  const cb = (a, b) => a + b.message + ', '
  return errArray.reduce(cb, '')
}

router.post('/forgot_password', async (request, response) => {
  const validate = ajv.compile(forgotPassowrdSchema)
  const isValid = validate(request.body)
  if (!isValid) {
    return response.status(400).json({
      success: false,
      results: null,
      error: sumErrors(validate.errors),
    })
  }
  auth
    .forgotPassword(request.body)
    .then((results) => {
      return response.status(200).json({
        success: true,
        results,
        error: null,
      })
    })
    .catch((error) => {
      if (error === 'Email not linked to the username') {
        return response.status(401).json({
          success: false,
          error,
          results: null,
        })
      }
      return response.status(400).json({
        success: false,
        results: null,
        error,
      })
    })
})

module.exports = router
