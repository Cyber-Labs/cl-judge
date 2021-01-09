const ajv = require('../index')
const createQuestionSchema = require('./createQuestion')
const updateQuestionSchema = require('./updateQuestion')
const addEditorSchema = require('./addEditor')
const addReaderSchema = require('./addReader')
const removeReaderSchema = require('./removeReader')

ajv.addFormat('arrPattern', (data) =>
  Array.isArray(JSON.parse(JSON.stringify(data)))
)

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
  addEditorSchema,
  removeEditorSchema: addEditorSchema,
  addReaderSchema,
  removeReaderSchema,
}
