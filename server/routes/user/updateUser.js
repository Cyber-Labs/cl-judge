const express = require('express')
const router = express.Router()
const middleware = require('../middlewares')
const user = require('../../models/user')
const ajv = require('../../schema')
const { updateUserSchema } = require('../../schema/user')

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
  '/update_user',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const validate = ajv.compile(updateUserSchema)
    const isValid = validate(request.body)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        results: null,
        error: sumErrors(validate.errors),
      })
    }
    user
      .updateUser(request)
      .then((results) => {
        return response.status(200).json({
          success: true,
          results,
          error: null,
        })
      })
      .catch((error) => {
        return response.status(400).json({
          success: false,
          results: null,
          error,
        })
      })
  }
)

module.exports = router
