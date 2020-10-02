const express = require('express')
const router = express.Router()
const middleware = require('../middlewares')
const auth = require('../../models/auth')
const ajv = require('../../schema')
const { updatePasswordSchema } = require('../../schema/auth')

/**
 *
 * @param {Array} errArray
 * @return {String}
 */

function sumErrors(errArray) {
  const cb = (a, b) => a + b.message + ', '
  return errArray.reduce(cb, '')
}

router.post(
  '/update_password',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const validate = ajv.compile(updatePasswordSchema)
    const isValid = validate(request.body)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        results: null,
        error: sumErrors(validate.errors),
      })
    }
    auth
      .updatePassword(request.body)
      .then((results) => {
        return response.status(200).json({
          success: true,
          error: null,
          results,
        })
      })
      .catch((error) => {
        if (error === 'Password incorrect') {
          return response.status(401).json({
            success: false,
            error,
            results: null,
          })
        }
        return response.status(400).json({
          success: false,
          error,
          results: null,
        })
      })
  }
)

module.exports = router
