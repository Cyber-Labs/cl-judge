const ajv = require('../index')
const createContestSchema = require('./createContest')
const addModeratorSchema = require('./addModerator')
const removeModeratorSchema = require('./removeModerator')
const updateContestSchema = require('./updateContest')

ajv.addFormat('dateTimeFormat', (dateTimeString) => {
  const timestamp = new Date(dateTimeString)
  return timestamp instanceof Object && typeof timestamp === 'object'
})

module.exports = {
  createContestSchema,
  addModeratorSchema,
  removeModeratorSchema,
  updateContestSchema,
}
