const express = require('express')
const { getPublicContestQuestions } = require('../../models/questions')
const router = express.Router()

router.get('/', (req, res) => {
  getPublicContestQuestions({
    ...req.query,
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
