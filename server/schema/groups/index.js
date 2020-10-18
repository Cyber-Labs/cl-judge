const createGroupSchema = require('./createGroup')
const removeGroupSchema = require('./removeGroup')
const addBranchSchema = require('./addBranch')
const removeBranchSchema = require('./removeBranch')
const addMembersSchema = require('./addMembers')
const removeMembersSchema = require('./removeMembers')
const addModeratorSchema = require('./addModerator')
const removeModeratorSchema = require('./removeModerator')
const updateGroupNameSchema = require('./updateGroupName')

module.exports = {
  createGroupSchema,
  removeGroupSchema,
  addBranchSchema,
  removeBranchSchema,
  addMembersSchema,
  removeMembersSchema,
  addModeratorSchema,
  removeModeratorSchema,
  updateGroupNameSchema,
}
