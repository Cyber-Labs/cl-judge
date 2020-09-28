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

router.use('/auth', authRouter.signupRouter)
router.use('/auth', authRouter.verifyEmailRouter)
router.use('/auth', authRouter.loginRouter)
router.use('/auth', authRouter.forgotPasswordRouter)
router.use('/auth', authRouter.resetPassowrdRouter)
router.use('/auth', authRouter.updatePasswordRouter)

app.use(router)
module.exports = app
