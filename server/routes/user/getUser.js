const express = require('express')
const router = express.Router()
const user = require('../../models/user')
const middleware = require('../middlewares')

router.get('/', middleware.verifyUserAccessToken, async (request, response) => {
  const username = request.username
  if (!username) {
    return response.status(400).json({
      succes: false,
      results: null,
      error: 'No user found with the given username',
    })
  }
  user
    .getUser(username)
    .then((results) => {
      return response.status(200).json({
        success: true,
        error: null,
        results,
      })
    })
    .catch((error) => {
      if (error === 'User not found') {
        return response.status(404).json({
          success: false,
          error,
          results: null,
        })
      }
      return response.status(400).json({
        success: false,
        error,
        results: null,
      })
    })
})

module.exports = router
