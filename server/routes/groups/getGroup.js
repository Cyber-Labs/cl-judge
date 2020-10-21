const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const groups = require('../../models/groups')
const { getGroupSchema } = require('../../schema/groups')
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

router.get(
  '/:group_id',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const validate = ajv.compile(getGroupSchema)
    const isValid = validate(request.params)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }
    groups
      .getGroup(request)
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
