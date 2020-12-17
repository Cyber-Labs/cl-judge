const express = require('express')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()
const { forkQuestion } = require('../../models/questions')

router.post('/:questionId/fork', verifyUserAccessToken, (req, res) => {
  forkQuestion({ questionId: req.params.questionId, username: req.username })
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
