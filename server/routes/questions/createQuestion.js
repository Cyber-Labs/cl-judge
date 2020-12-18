const express = require('express')
const { verifyUserAccessToken, verifyAdmin } = require('../middlewares')
const router = express.Router()
const ajv = require('../../schema')
const { createQuestionSchema } = require('../../schema/questions')
const { createQuestion } = require('../../models/questions')

/**
 *
 * @param {Array} errArray
 * @return {String}
 */
function sumErrors(errArray) {
  const cb = (a, b) => a + b.message + ', '
  return errArray.reduce(cb, '')
}

router.post('/', verifyUserAccessToken, verifyAdmin, (req, res) => {
  const validate = ajv.compile(createQuestionSchema)
  const isValid = validate(req.body)
  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: sumErrors(validate.errors),
      results: null,
    })
  }
  createQuestion({ ...req.body, username: req.username })
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
})

module.exports = router
