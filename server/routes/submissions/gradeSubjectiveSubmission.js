const express = require('express')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()
const ajv = require('../../schema')
const { gradeSubjectiveSubmissionSchema } = require('../../schema/submissions')
const { gradeSubjectiveSubmission } = require('../../models/submissions')

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
  '/:contestId/subjective_submissions/:submissionId/grade',
  verifyUserAccessToken,
  (req, res) => {
    const validate = ajv.compile(gradeSubjectiveSubmissionSchema)
    const isValid = validate(req.body)
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: sumErrors(validate.errors),
        results: null,
      })
    }
    gradeSubjectiveSubmission({
      ...req.body,
      username: req.username,
      submissionId: req.params.submissionId,
      contestId: req.params.contestId,
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
