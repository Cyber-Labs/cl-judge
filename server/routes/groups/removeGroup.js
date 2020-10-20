const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const groups = require('../../models/groups')
const { removeGroupSchema } = require('../../schema/groups')
const middleware = require('../middlewares')

/**
 *
 * @param {Array} errArray
 * @return {String}
 */
function sumErrors(errArray) {
  const cb = (a, b) => a + b.message + ', '
  return errArray.reduce(cb, '')
}

router.delete(
  '/:group_id',
  middleware.verifyUserAccessToken,
  middleware.verifyAdmin,
  async (request, response) => {
    const validate = ajv.compile(removeGroupSchema)
    const isValid = validate(request.params)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }
    groups
      .removeGroup(request)
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
  }
)

module.exports = router
