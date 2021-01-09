const { pool } = require('../../models/database')

const deleteUnverifiedAccounts = () => {
  pool.query(
    `DELETE FROM users WHERE verified IS NULL AND NOW() >= otp_valid_upto`,
    (error, results) => {
      if (error) {
        console.log(error)
      }
      if (results) {
        console.log(results)
      }
    }
  )
}

module.exports = { deleteUnverifiedAccounts }
