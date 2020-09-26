const { pool } = require('../database')

function getDetails() {
  return new Promise(async (resolve, reject) => {
    pool.query(`SELECT * FROM user`, (error, results, fields) => {
        if(error) {
            return reject(error)
        }
        return resolve(results)
    })
  })
}

module.exports = getDetails;
