const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const groups = require('../../models/groups')
const { updateGroupNameSchema } = require('../../schema/groups')
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
  '/:group_id/update',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const validate = ajv.compile(updateGroupNameSchema)
    const toValidate = {
      group_id: request.params.group_id,
      new_group_name: request.body.new_group_name,
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
      .updateGroupName(request)
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
