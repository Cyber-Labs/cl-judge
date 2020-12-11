const ajv = require('../index')
const createQuestionSchema = require('./createQuestion')
const updateQuestionSchema = require('./updateQuestion')

ajv.addFormat('optionsPattern', (data) =>
  Array.isArray(JSON.parse(JSON.stringify(data)))
)

module.exports = {
  createQuestionSchema,
  updateQuestionSchema,
}
