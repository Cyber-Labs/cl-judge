const schema = {
  required: ['name'],
  properties: {
    name: {
      type: 'string',
      minLength: 2,
    },
  },
  errorMessage: {
    required: {
      name: 'Name required',
    },
    properties: {
      name: 'Invalid name',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
