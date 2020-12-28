/* eslint-disable no-unused-vars */
const express = require('express')
const router = express.Router()
const contests = require('../../models/contests')
const middleware = require('../middlewares')
const csv = require('csv-express')

router.get(
  '/:contest_id/participants_details',
  middleware.verifyUserAccessToken,
  async (request, response) => {
    const { query } = request
    const { download_csv } = query
    contests
      .getAllParticipantsDetails(request)
      .then((results) => {
        if (!download_csv) {
          return response.status(200).json({
            success: true,
            error: null,
            results,
          })
        } else {
          const { participant_records } = results
          return response.csv(participant_records, true)
        }
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
