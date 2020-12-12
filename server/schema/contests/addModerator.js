const schema = {
  required: ['moderator'],
  properties: {
    moderator: {
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      moderator: 'Moderator username required',
    },
    properties: {
      moderator: 'Invalid moderator username',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
