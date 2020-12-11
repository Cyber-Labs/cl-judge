const schema = {
  required: ['moderator_username'],
  properties: {
    moderator_username: {
      type: 'string',
      minLength: 4,
    },
  },
  errorMessage: {
    required: {
      moderator_username: 'Moderator username required',
    },
    properties: {
      moderator_username: 'Invalid moderator username',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
