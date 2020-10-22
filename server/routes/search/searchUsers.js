const express = require('express')
const router = express.Router()
const middleware = require('../middlewares')
const search = require('../../models/search')

const DEFAULT_SEARCH_LIMIT = 5

router.get(
  '/users',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const { query } = request
    let { keyword, limit } = query
    limit = Number(limit)
    if (!limit) {
      limit = DEFAULT_SEARCH_LIMIT
    }
    search
      .searchUsers({ keyword, limit })
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
