const express = require('express')
const app = express()
const router = express.Router()

app.use(
    express.urlencoded({
        extended: false
    })
)
app.use(express.json())

const authRouter = require('./auth')
router.use('/auth', authRouter)

app.use(router)

module.exports = app
