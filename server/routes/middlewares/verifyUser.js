const fs = require('fs')
const jwt = require('jsonwebtoken')

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

function verifyUserAccessToken(request, response, next) {
  if (request.headers.access_token) {
    const path = require('path')
    const pubKey = fs.readFileSync(path.resolve('rsa_secret.pub'), 'utf-8')
    jwt.verify(request.headers.access_token, pubKey, (error, decoded) => {
      if (error) {
        const { name } = error
        let errMessage = ''
        if (name === 'TokenExpiredError')
          errMessage =
            'It has been a long time since you have logged in. You need to logout and login again, to continue.'
        response.status(401).json({
          success: false,
          results: null,
          error: errMessage || error.message,
        })
        return
      }
      request.username = decoded.username
      next()
    })
  } else {
    response.status(401).json({
      success: false,
      results: null,
      error: 'Access code not included in the header of the request',
    })
    return
  }
}

module.exports = verifyUserAccessToken
