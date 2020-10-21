const express = require('express')
const router = express.Router()
const groups = require('../../models/groups')
const middleware = require('../middlewares')

router.get(
  '/moderator_groups',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    groups
      .getModeratorGroups(request)
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
