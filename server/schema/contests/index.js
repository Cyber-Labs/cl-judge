const ajv = require('../index')
const createContestSchema = require('./createContest')
const updateContestSchema = require('./updateContest')
const addModeratorSchema = require('./addModerator')
const removeModeratorSchema = require('./removeModerator')
const addGroupSchema = require('./addGroup')
const removeGroupSchema = require('./removeGroup')

ajv.addFormat('dateTimeFormat', (dateTimeString) => {
  return !isNaN(Date.parse(dateTimeString))
})

module.exports = {
  createContestSchema,
  updateContestSchema,
  addModeratorSchema,
  removeModeratorSchema,
  addGroupSchema,
  removeGroupSchema,
}
