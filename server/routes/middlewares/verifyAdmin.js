// Should be used after the middleware 'verifyUserAccessToken'

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

function verifyAdmin(request, response, next) {
  if (request.isAdmin) {
    next()
  } else {
    response.status(401).json({
      success: false,
      results: null,
      error: "You don't have admin priviledges",
    })
  }
}

module.exports = verifyAdmin
