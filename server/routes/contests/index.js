const createContestRouter = require('./createContest')
const updateContestRouter = require('./updateContest')
const addModeratorRouter = require('./addModerator')
const removeModeratorRouter = require('./removeModerator')
const addGroupRouter = require('./addGroup')
const removeGroupRouter = require('./removeGroup')

module.exports = {
  createContestRouter,
  updateContestRouter,
  addModeratorRouter,
  removeModeratorRouter,
  addGroupRouter,
  removeGroupRouter,
}
