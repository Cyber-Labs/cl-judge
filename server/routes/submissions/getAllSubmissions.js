const express = require('express')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()
const { getAllSubmissions } = require('../../models/submissions')
// eslint-disable-next-line no-unused-vars
const csv = require('csv-express')

router.get('/:contestId/submissions', verifyUserAccessToken, (req, res) => {
  const { query } = req
  const { download_csv } = query
  getAllSubmissions(req)
    .then((results) => {
      if (!download_csv) {
        return res.status(200).json({
          success: true,
          results,
          error: null,
        })
      } else {
        const { submissions } = results
        return res.csv(submissions, true)
      }
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
