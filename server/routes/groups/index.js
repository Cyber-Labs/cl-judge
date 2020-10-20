const createGroupRouter = require('./createGroup')
const removeGroupRouter = require('./removeGroup')
// const addBranchRouter = require('./addBranch')
// const removeBranchRouter = require('./removeBranch')
// const addMembersRouter = require('./addMembers')
// const removeMembersRouter = require('./removeMembers')
const addModeratorRouter = require('./addModerator')
const removeModeratorRouter = require('./removeModerator')
const updateGroupNameRouter = require('./updateGroupName')
const getGroupRouter = require('./getGroup')
const getModeratorGroupsRouter = require('./getModeratorGroups')
const getAllGroupsRouter = require('./getAllGroups')

module.exports = {
  createGroupRouter,
  removeGroupRouter,
  addModeratorRouter,
  removeModeratorRouter,
  updateGroupNameRouter,
  getGroupRouter,
  getModeratorGroupsRouter,
  getAllGroupsRouter,
}
