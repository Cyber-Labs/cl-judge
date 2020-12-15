// Should be used after the middleware 'verifyUserAccessToken'
const { pool } = require('../../models/database')

/**
 * @typedef {import { Request } from "express";} Request
 * @typedef {import { Response } from "express";} Response
 * @typedef {import { next } from "express";} Next
 */

/**
 *
 * @param {Request} request
 * @param {Response} response
 * @param {Next} next
 */

function verifyContestModerator(request, response, next) {
  const { contest_id: contestId } = request.params
  const { username } = request
  pool.query(
    `SELECT * FROM contests_moderators WHERE contest_id=? AND moderator=?`,
    [contestId, username],
    (error, results) => {
      if (error) {
        response.status(401).json({
          success: false,
          results: null,
          error,
        })
      }
      if (!results || !results.length) {
        response.status(401).json({
          success: false,
          results: null,
          error:
            'Invalid contest ID or you do not have moderator access to the contest',
        })
      }
      next()
    }
  )
}

module.exports = verifyContestModerator
