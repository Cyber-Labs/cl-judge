const createQuestion = require('./createQuestion')
const getQuestion = require('./getQuestion')
const getEditorQuestions = require('./getEditorQuestions')
const getReaderQuestions = require('./getReaderQuestions')
const getPublicContestQuestions = require('./getPublicContestQuestions')
const updateQuestion = require('./updateQuestion')
const addEditor = require('./addEditor')
const removeEditor = require('./removeEditor')
const addReader = require('./addReader')
const removeReader = require('./removeReader')
const forkQuestion = require('./forkQuestion')
const getAllEditors = require('./getAllEditors')
const getAllReaders = require('./getAllReaders')
const updateEditorToReader = require('./updateEditorToReader')

module.exports = {
  createQuestion,
  getQuestion,
  getEditorQuestions,
  getReaderQuestions,
  getPublicContestQuestions,
  updateQuestion,
  addEditor,
  removeEditor,
  addReader,
  removeReader,
  forkQuestion,
  getAllEditors,
  getAllReaders,
  updateEditorToReader,
}
