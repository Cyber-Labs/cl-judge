const createQuestion = require('./createQuestion')
const getQuestion = require('./getQuestion')
const getEditorQuestions = require('./getEditorQuestions')
const getPublicContestQuestions = require('./getPublicContestQuestions')
const updateQuestion = require('./updateQuestion')
const addEditor = require('./addEditor')
const removeEditor = require('./removeEditor')
const forkQuestion = require('./forkQuestion')

module.exports = {
  createQuestion,
  getQuestion,
  getEditorQuestions,
  getPublicContestQuestions,
  updateQuestion,
  addEditor,
  removeEditor,
  forkQuestion,
}
