/* eslint-disable no-async-promise-executor */
const fs = require('fs')
const jwt = require('jsonwebtoken')
const { isPasswordCorrect } = require('../utils')

/**
 *
 * @param {*} param0
 * @param {String} param0.username
 * @param {String} param0.password
 * @return {Promise}
 */

function login({ username, password }) {
  return new Promise(async (resolve, reject) => {
    let correct, isAdmin
    try {
      const status = await isPasswordCorrect(username, password)
      correct = status.correct
      isAdmin = status.isAdmin
    } catch (error) {
      return reject(error)
    }
    if (correct) {
      const path = require('path')
      const privateKey = fs.readFileSync(
        path.resolve('rsa_secret.pub'),
        'utf-8'
      )
      jwt.sign(
        { username, isAdmin },
        privateKey,
        { expiresIn: '24h' },
        (error, accessToken) => {
          if (error) {
            return reject(`error = ${error}`)
          }
          return resolve({ username, isAdmin, access_token: accessToken })
        }
      )
    } else {
      return reject('Password incorrect')
    }
  })
}

module.exports = login
