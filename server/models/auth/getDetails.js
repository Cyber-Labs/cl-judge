const { pool } = require('../database')

function getDetails() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM user`, (error, results) => {
            if (error) {
                return reject(error)
            }
            return resolve(results)
        })
    })
}

module.exports = getDetails
