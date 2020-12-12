const express = require('express')
const router = express.Router()
const ajv = require('../../schema')
const { createTagSchema } = require('../../schema/tags')
const middleware = require('../middlewares')
const tags = require('../../models/tags')

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
  '/',
  middleware.verifyUserAccessToken,
  middleware.verifyAdmin,
  async (request, response) => {
    const validate = ajv.compile(createTagSchema)
    const isValid = validate(request.body)
    if (!isValid) {
      return response.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }
    tags
      .createTag(request)
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
