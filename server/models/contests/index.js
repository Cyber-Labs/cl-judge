const createContest = require('./createContest')
const updateContest = require('./updateContest')
const addModerator = require('./addModerator')
const removeModerator = require('./removeModerator')
const addGroup = require('./addGroup')
const removeGroup = require('./removeGroup')
const getContests = require('./getContests')
const getModeratorContests = require('./getModeratorContests')
const getContest = require('./getContest')
const getContestDetails = require('./getContestDetails')
const getContestModerators = require('./getContestModerators')
const participate = require('./participate')
const getAllParticipants = require('./getAllParticipants')
const getAllParticipantsDetails = require('./getAllParticipantsDetails')
const addQuestion = require('./addQuestion')
const removeQuestion = require('./removeQuestion')
const updateQuestion = require('./updateQuestion')
const getAllQuestions = require('./getAllQuestions')
const getQuestion = require('./getQuestion')

module.exports = {
  createContest,
  updateContest,
  addModerator,
  removeModerator,
  addGroup,
  removeGroup,
  getContests,
  getModeratorContests,
  getContest,
  getContestDetails,
  getContestModerators,
  participate,
  getAllParticipants,
  getAllParticipantsDetails,
  addQuestion,
  removeQuestion,
  updateQuestion,
  getQuestion,
  getAllQuestions,
}
