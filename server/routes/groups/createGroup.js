const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const groups = require('../../models/groups')
const { createGroupSchema } = require('../../schema/groups')
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
  '/create_group',
  middleware.verifyUserAccessToken,
  middleware.verifyAdmin,
  async (request, response) => {
    const validate = ajv.compile(createGroupSchema)
    const isValid = validate(request.body)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }

    const { username, isAdmin } = request
    if (!username) {
      return response.status(400).json({
        succes: false,
        results: null,
        error: 'No user found with the given username',
      })
    }
    if (!isAdmin || isAdmin === null) {
      return response.status(400).json({
        success: false,
        results: null,
        error: 'Current user do not have admin privilidges',
      })
    }
    groups
      .createGroup(request)
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
