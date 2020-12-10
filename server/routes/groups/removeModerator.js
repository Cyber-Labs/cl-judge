const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const groups = require('../../models/groups')
const { removeModeratorSchema } = require('../../schema/groups')
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
  '/:group_id/moderator',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const validate = ajv.compile(removeModeratorSchema)
    const toValidate = {
      group_id: request.params.group_id,
      moderator_username: request.body.moderator_username,
    }
    const isValid = validate(toValidate)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }
    groups
      .removeModerator(request)
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
