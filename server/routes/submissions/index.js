const createSubmission = require('./createSubmission')
const getAllSubmissions = require('./getAllSubmissions')
const getUserContestSubmissions = require('./getUserContestSubmissions')
const getMCQSubmission = require('./getMCQSubmission')
const getSubjectiveSubmission = require('./getSubjectiveSubmission')
const gradeSubjectiveSubmission = require('./gradeSubjectiveSubmission')
const getContestLeaderboard = require('./getContestLeaderboard')
const getQuestionLeaderboard = require('./getQuestionLeaderboard')

module.exports = {
  createSubmission,
  getAllSubmissions,
  getUserContestSubmissions,
  getMCQSubmission,
  getSubjectiveSubmission,
  gradeSubjectiveSubmission,
  getContestLeaderboard,
  getQuestionLeaderboard,
}
