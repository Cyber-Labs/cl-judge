const express = require('express')
const router = express.Router()
const middleware = require('../middlewares')
const tags = require('../../models/tags')

router.get('/', middleware.verifyUserAccessToken, async (request, response) => {
  tags
    .getTag(request)
    .then((results) => {
      return response.status(200).json({
        success: true,
        error: null,
        results,
      })
    })
    .catch((error) => {
      return response.status(400).json({
        success: false,
        error,
        results: null,
      })
    })
})

module.exports = router
