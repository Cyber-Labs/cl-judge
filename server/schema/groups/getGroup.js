const schema = {
  required: ['group_id'],
  properties: {
    group_id: {
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      group_id: 'Group Id required',
    },
    properties: {
      group_id: 'Invalid group Id',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
