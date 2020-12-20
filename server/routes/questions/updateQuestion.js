const express = require('express')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()
const ajv = require('../../schema')
const { updateQuestionSchema } = require('../../schema/questions')
const { updateQuestion } = require('../../models/questions')

/**
 *
 * @param {Array} errArray
 * @return {String}
 */
function sumErrors(errArray) {
  const cb = (a, b) => a + b.message + ', '
  return errArray.reduce(cb, '')
}

router.post('/:questionId/update', verifyUserAccessToken, (req, res) => {
  const validate = ajv.compile(updateQuestionSchema)
  const isValid = validate(req.body)
  if (!isValid) {
    return res.status(400).json({
      success: false,
      error: sumErrors(validate.errors),
      results: null,
    })
  }
  updateQuestion({
    questionId: req.params.questionId,
    username: req.username,
    questionFields: {
      name: req.body.name,
      problem_statement: req.body.problem_statement,
      type: req.body.type,
      input_format: req.body.input_format,
      output_format: req.body.output_format,
      constraints: req.body.constraints,
      options: req.body.options,
      difficulty: req.body.difficulty,
      correct: req.body.correct,
    },
    tags: req.body.tags,
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
})

module.exports = router
