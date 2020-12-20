const express = require('express')
const router = express.Router()
const contests = require('../../models/contests')
const middleware = require('../middlewares')

router.get(
  '/moderator_contests',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    contests
      .getModeratorContests(request)
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
  }
)

module.exports = router
