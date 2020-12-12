const createContestSchema = require('./createContest')
const addModeratorSchema = require('./addModerator')
const removeModeratorSchema = require('./removeModerator')
const updateContestSchema = require('./updateContest')

module.exports = {
  createContestSchema,
  addModeratorSchema,
  removeModeratorSchema,
  updateContestSchema,
}
