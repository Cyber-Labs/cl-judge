const createContestRouter = require('./createContest')
const updateContestRouter = require('./updateContest')
const addModeratorRouter = require('./addModerator')
const removeModeratorRouter = require('./removeModerator')
const addGroupRouter = require('./addGroup')
const removeGroupRouter = require('./removeGroup')
const getContestRouter = require('./getContest')
const getContestsRouter = require('./getContests')
const getModeratorContestsRouter = require('./getModeratorContests')
const getContestModeratorsRouter = require('./getContestModerators')
const participateRouter = require('./participate')
const getAllParticipantsRouter = require('./getAllParticipants')
const getAllParticipantsDetailsRouter = require('./getAllParticipantsDetails')

module.exports = {
  createContestRouter,
  updateContestRouter,
  addModeratorRouter,
  removeModeratorRouter,
  addGroupRouter,
  removeGroupRouter,
  getContestRouter,
  getContestsRouter,
  getModeratorContestsRouter,
  getContestModeratorsRouter,
  participateRouter,
  getAllParticipantsRouter,
  getAllParticipantsDetailsRouter,
}
