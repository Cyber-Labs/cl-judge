const schema = {
  required: ['group_id', 'new_group_name'],
  properties: {
    group_id: {
      type: 'string',
    },
    new_group_name: {
      type: 'string',
      minLength: 4,
    },
  },
  errorMessage: {
    required: {
      group_id: 'Group Id required',
      new_group_name: 'New group name required',
    },
    properties: {
      group_id: 'Invalid group Id',
      new_group_name: 'Invalid new group name',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
