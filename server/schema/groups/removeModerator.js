const schema = {
  required: ['group_id', 'moderator_username'],
  properties: {
    group_id: {
      type: 'string',
    },
    moderator_username: {
      type: 'string',
      minLength: 4,
    },
  },
  errorMessage: {
    required: {
      group_id: 'Group Id required',
      moderator_username: 'Moderator username required',
    },
    properties: {
      group_id: 'Invalid group Id',
      moderator_username: 'Invalid moderator username',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
