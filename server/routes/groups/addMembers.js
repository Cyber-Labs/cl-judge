const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const groups = require('../../models/groups')
const { addMembersSchema } = require('../../schema/groups')
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
  '/:group_id/members',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const validate = ajv.compile(addMembersSchema)
    const toValidate = {
      group_id: request.params.group_id,
      members: request.body.members,
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
      .addMembers(request)
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
