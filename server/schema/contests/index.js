const ajv = require('../index')
const createContestSchema = require('./createContest')
const updateContestSchema = require('./updateContest')
const addModeratorSchema = require('./addModerator')
const removeModeratorSchema = require('./removeModerator')
const addGroupSchema = require('./addGroup')
const removeGroupSchema = require('./removeGroup')

ajv.addFormat('dateTimeFormat', (dateTimeString) => {
  const timestamp = new Date(dateTimeString)
  return timestamp instanceof Object && typeof timestamp === 'object'
})

module.exports = {
  createContestSchema,
  updateContestSchema,
  addModeratorSchema,
  removeModeratorSchema,
  addGroupSchema,
  removeGroupSchema,
}
