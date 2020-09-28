const express = require('express')
const router = express.Router()
const auth = require('../../models/auth')
const middleware = require('../middlewares')

router.get(
  '/:username',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const username = request.params.username
    if (!username) {
      return response.status(400).json({
        succes: false,
        results: null,
        error: 'No user found with the given username'
      })
    }
    auth
      .getUser(username)
      .then(results => {
        return response.status(200).json({
          success: true,
          error: null,
          results
        })
      })
      .catch(error => {
        if (error === 'User not found') {
          return response.status(404).json({
            success: false,
            error,
            results: null
          })
        }
        return response.status(400).json({
          success: false,
          error,
          results: null
        })
      })
  }
)

module.exports = router
