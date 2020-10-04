const testServer = require('../../routes')
const dotenv = require('dotenv')
const mysql = require('mysql')

const config = dotenv.config()
if (!config) {
  console.log(config.error)
}

const mockOptions = {
  host: process.env.HOST,
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}

module.exports = {
    mysql,
    testServer,
    mockOptions
}
