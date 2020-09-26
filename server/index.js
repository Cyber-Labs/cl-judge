const dotenv = require('dotenv')
const { createPool } = require('mysql')

const config = dotenv.config()
if (!config) {
    console.log(config.error)
}

const host = process.env.HOST
const user = process.env.USER
const password = process.env.PASSWORD
const database = process.env.DATABASE
const port = process.env.PORT || 5000

const pool = createPool({
    host: host,
    user: "root",
    password: password,
    database: database
})


pool.query(`SELECT * FROM user`, (error, results, fields) => {
    if(error) {
        console.log(error)
        return
    }
    console.log(results)
})

/*
const server = require('./routes)
server.listen(port, () => {
    console.log(`Server is running on host: ${host} and port: ${port}`)
})
*/