const schema = {
  required: ['group_name', 'confidential', 'members'],
  properties: {
    group_name: {
      type: 'string',
      minLength: 4,
    },
    confidential: {
      type: 'boolean',
    },
    members: {
      type: 'array',
    },
  },
  errorMessage: {
    required: {
      group_name: 'Group name required',
      confidential: 'Confidentiality required',
      members: 'Members array required',
    },
    properties: {
      group_name: 'Invalid group name',
      confidential: 'Invalid confidentiality',
      members: 'Invalid members array',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
