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
const userRouter = require('./user')
const groupsRouter = require('./groups')
const notificationsRouter = require('./notifications')
const searchRouter = require('./search')

router.use('/auth', authRouter.signupRouter)
router.use('/auth', authRouter.verifyEmailRouter)
router.use('/auth', authRouter.loginRouter)
router.use('/auth', authRouter.forgotPasswordRouter)
router.use('/auth', authRouter.resetPassowrdRouter)
router.use('/auth', authRouter.verifyNewEmailRouter)

router.use('/user', userRouter.getUserRouter)
router.use('/user', userRouter.updateUserRouter)
router.use('/user', userRouter.updatePasswordRouter)
router.use('/user', userRouter.updateProfileImageRouter)

router.use('/groups', groupsRouter.createGroupRouter)
router.use('/groups', groupsRouter.removeGroupRouter)
router.use('/groups', groupsRouter.addBranchRouter)
router.use('/groups', groupsRouter.removeBranchRouter)
router.use('/groups', groupsRouter.addMembersRouter)
router.use('/groups', groupsRouter.removeMembersRouter)
router.use('/groups', groupsRouter.addModeratorRouter)
router.use('/groups', groupsRouter.removeModeratorRouter)
router.use('/groups', groupsRouter.updateGroupNameRouter)
router.use('/groups', groupsRouter.getModeratorGroupsRouter)
router.use('/groups', groupsRouter.getGroupRouter)
router.use('/groups', groupsRouter.getAllGroupsRouter)

router.use('/notifications', notificationsRouter.createNotificationRouter)
router.use('/notifications', notificationsRouter.getNotificationsRouter)
router.use('/notifications', notificationsRouter.getCreatorNotificationsRouter)

router.use('/search', searchRouter.searchUsersRouter)

app.use(router)

// Default error handler for internal server errors
app.use(function (error, req, res, next) {
  console.error(error.stack)
  res.status(500).json({ success: false, results: null, error })
  next()
})

module.exports = app
