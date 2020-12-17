const ajv = require('../index')
const createQuestionSchema = require('./createQuestion')
const updateQuestionSchema = require('./updateQuestion')
const addEditorSchema = require('./addEditor')

ajv.addFormat('arrPattern', (data) =>
  Array.isArray(JSON.parse(JSON.stringify(data)))
)

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
  addEditorSchema,
}
