const express = require('express')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()
const ajv = require('../../schema')
const { updateEditorToReaderSchema } = require('../../schema/questions')
const { updateEditorToReader } = require('../../models/questions')

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
  '/:questionId/updateEditorToReader',
  verifyUserAccessToken,
  (req, res) => {
    const validate = ajv.compile(updateEditorToReaderSchema)
    const isValid = validate(req.body)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }
    updateEditorToReader({
      ...req.body,
      username: req.username,
      questionId: req.params.questionId,
    })
      .then((results) => {
        return res.status(200).json({
          success: true,
          results,
          error: null,
        })
      })
      .catch((error) => {
        return res.status(400).json({
          success: false,
          results: null,
          error,
        })
      })
  }
)

module.exports = router
