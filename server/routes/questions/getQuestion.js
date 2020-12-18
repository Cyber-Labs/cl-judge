const express = require('express')
const { getQuestion } = require('../../models/questions')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()

router.get('/:questionId', verifyUserAccessToken, (req, res) => {
  getQuestion({ username: req.username, questionId: req.params.questionId })
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
