const createGroup = require('./createGroup')
const removeGroup = require('./removeGroup')
const addBranch = require('./addBranch')
const removeBranch = require('./removeBranch')
const addMembers = require('./addMembers')
const removeMembers = require('./removeMembers')
const addModerator = require('./addModerator')
const removeModerator = require('./removeModerator')
const updateGroupName = require('./updateGroupName')
const getGroup = require('./getGroup')
const getModeratorGroups = require('./getModeratorGroups')
const getAllGroups = require('./getAllGroups')

module.exports = {
  createGroup,
  removeGroup,
  addBranch,
  removeBranch,
  addMembers,
  removeMembers,
  addModerator,
  removeModerator,
  updateGroupName,
  getGroup,
  getModeratorGroups,
  getAllGroups,
}
