const express = require('express')
const { corsWithOptions } = require('./cors')
const app = express()
const router = express.Router()
app.use(corsWithOptions)
app.use(
  express.urlencoded({
    extended: false,
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
router.use('/auth', authRouter.updateUserRouter)
router.use('/auth', authRouter.verifyNewEmailRouter)
router.use('/users', authRouter.getUserRouter)

app.use(router)
module.exports = app
