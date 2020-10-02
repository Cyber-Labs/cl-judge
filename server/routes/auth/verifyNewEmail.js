const express = require('express')
const router = express.Router()
const auth = require('../../models/auth')
const ajv = require('../../schema')
const { verifyNewEmailSchema } = require('../../schema/auth')

/**
 *
 * @param {Array} errArray
 * @return {String}
 */

function sumErrors(errArray) {
  const cb = (a, b) => a + b.message + ', '
  return errArray.reduce(cb, '')
}

router.post('/verify_new_email', async (request, response) => {
  const validate = ajv.compile(verifyNewEmailSchema)
  const isValid = validate(request.body)
  if (!isValid) {
    return response.status(400).json({
      success: false,
      results: null,
      error: sumErrors(validate.errors),
    })
  }
  auth
    .verifyNewEmail(request.body)
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
        results: null,
        error,
      })
    })
})

module.exports = router
