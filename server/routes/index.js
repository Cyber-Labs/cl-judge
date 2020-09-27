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

router.use('/auth', authRouter.getDetailsRouter)
router.use('/auth', authRouter.signupRouter)
router.use('/auth', authRouter.verifyEmailRouter)

app.use(router)
module.exports = app
