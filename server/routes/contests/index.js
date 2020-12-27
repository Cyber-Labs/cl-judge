const createContestRouter = require('./createContest')
const updateContestRouter = require('./updateContest')
const addModeratorRouter = require('./addModerator')
const removeModeratorRouter = require('./removeModerator')
const addGroupRouter = require('./addGroup')
const removeGroupRouter = require('./removeGroup')
const getContestsRouter = require('./getContests')
const getModeratorContestsRouter = require('./getModeratorContests')
const getContestRouter = require('./getContest')
const getContestDetailsRouter = require('./getContestDetails')
const getContestModeratorsRouter = require('./getContestModerators')
const participateRouter = require('./participate')
const getAllParticipantsRouter = require('./getAllParticipants')
const getAllParticipantsDetailsRouter = require('./getAllParticipantsDetails')
const addQuestionRouter = require('./addQuestion')
const removeQuestionRouter = require('./removeQuestion')
const getAllQuestionsRouter = require('./getAllQuestions')
const getQuestionRouter = require('./getQuestion')

module.exports = {
  createContestRouter,
  updateContestRouter,
  addModeratorRouter,
  removeModeratorRouter,
  addGroupRouter,
  removeGroupRouter,
  getContestsRouter,
  getModeratorContestsRouter,
  getContestRouter,
  getContestDetailsRouter,
  getContestModeratorsRouter,
  participateRouter,
  getAllParticipantsRouter,
  getAllParticipantsDetailsRouter,
  addQuestionRouter,
  removeQuestionRouter,
  getQuestionRouter,
  getAllQuestionsRouter,
}
