const express = require('express')
const router = express.Router()
const middleware = require('../middlewares')
const notifications = require('../../models/notifications')

const MAX_NOTIFICATIONS_LIMIT = 100

router.get(
  '/creator_notifications',
  middleware.verifyUserAccessToken,
  middleware.verifyAdmin,
  async (request, response) => {
    const { username, query } = request
    let { limit } = query
    limit = Number(limit)
    if (!limit) {
      limit = MAX_NOTIFICATIONS_LIMIT
    }
    notifications
      .getCreatorNotifications({ username, limit })
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
