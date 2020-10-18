const schema = {
  required: ['group_id', 'members'],
  properties: {
    group_id: {
      type: 'string',
    },
    members: {
      type: 'array',
    },
  },
  errorMessage: {
    required: {
      group_id: 'Group Id required',
      members: 'Members array required',
    },
    properties: {
      group_id: 'Invalid group Id',
      members: 'Invalid members array',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
