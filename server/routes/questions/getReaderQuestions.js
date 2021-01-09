const express = require('express')
const { getReaderQuestions } = require('../../models/questions')
const { verifyUserAccessToken } = require('../middlewares')
const router = express.Router()

router.get('/reader_questions', verifyUserAccessToken, (req, res) => {
  getReaderQuestions({
    ...req.query,
    username: req.username,
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
