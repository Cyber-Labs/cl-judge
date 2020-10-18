const schema = {
  required: ['group_name', 'confidential', 'members'],
  properties: {
    group_name: {
      type: 'string',
      minLength: 4,
    },
    confidentail: {
      type: 'boolean',
    },
    members: {
      type: 'array',
    },
  },
  errorMessage: {
    required: {
      group_name: 'Group name required',
      confidentail: 'Confidentiality required',
      members: 'Members array required',
    },
    properties: {
      group_name: 'Invalid group name',
      confidentail: 'Invalid confidentiality',
      members: 'Invalid members array',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
