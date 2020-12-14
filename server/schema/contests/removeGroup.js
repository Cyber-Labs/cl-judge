const schema = {
  required: ['group_id'],
  properties: {
    group_id: {
      type: 'number',
    },
  },
  errorMessage: {
    required: {
      group_id: 'Group id required',
    },
    properties: {
      group_id: 'Invalid group id',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
