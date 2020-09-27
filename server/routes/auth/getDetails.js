const auth = require('../../models/auth')
const express = require('express')
const router = express.Router()

router.get('/getDetails', async (request, response) => {
  auth
    .getDetails(request.body)
    .then(results => {
      return response.status(200).json({
        success: true,
        error: null,
        results
      })
    })
    .catch(error => {
      return response.status(400).json({
        success: false,
        error,
        results: null
      })
    })
})

module.exports = router
