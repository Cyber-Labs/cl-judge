const createQuestion = require('./createQuestion')
const getQuestion = require('./getQuestion')
const getEditorReaderQuestions = require('./getEditorReaderQuestions')
const getPublicContestQuestions = require('./getPublicContestQuestions')
const updateQuestion = require('./updateQuestion')
const addEditor = require('./addEditor')
const removeEditor = require('./removeEditor')
const addReader = require('./addReader')
const removeReader = require('./removeReader')
const forkQuestion = require('./forkQuestion')
const getAllEditorsReaders = require('./getAllEditorsReaders')
const updateEditorToReader = require('./updateEditorToReader')

module.exports = {
  createQuestion,
  getQuestion,
  getEditorReaderQuestions,
  getPublicContestQuestions,
  updateQuestion,
  addEditor,
  removeEditor,
  addReader,
  removeReader,
  forkQuestion,
  getAllEditorsReaders,
  updateEditorToReader,
}
