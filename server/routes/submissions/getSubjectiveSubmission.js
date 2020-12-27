const express = require('express')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()
const { getSubjectiveSubmission } = require('../../models/submissions')

router.get(
  '/:contestId/subjective_submissions/:submissionId',
  verifyUserAccessToken,
  (req, res) => {
    getSubjectiveSubmission(req)
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
