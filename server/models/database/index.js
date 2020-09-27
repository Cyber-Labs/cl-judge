const dotenv = require('dotenv')
const { createPool } = require('mysql')

const config = dotenv.config()
if (!config) {
  console.log(config.error)
}

const host = process.env.HOST
const password = process.env.PASSWORD
const database = process.env.DATABASE
// const port = process.env.PORT || 5000
// const user = process.env.USER

const pool = createPool({
  host: host,
  user: 'root',
  password: password,
  database: database
})

module.exports = { pool }
