const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const contests = require('../../models/contests')
const { addGroupSchema } = require('../../schema/contests')
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

router.post(
  '/:contest_id/groups',
  middleware.verifyUserAccessToken,
  middleware.verifyContestModerator,
  async (request, response) => {
    const validate = ajv.compile(addGroupSchema)
    const isValid = validate(request.body)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }
    contests
      .addGroup(request)
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
