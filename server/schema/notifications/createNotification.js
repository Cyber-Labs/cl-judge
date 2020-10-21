const schema = {
  required: ['heading', 'public', 'target_usernames'],
  properties: {
    heading: {
      type: 'string',
      minLength: 3,
    },
    description: {
      type: 'string',
    },
    public: {
      type: 'boolean',
    },
    target_usernames: {
      type: 'array',
    },
  },
  errorMessage: {
    required: {
      heading: 'Heading required',
    },
    properties: {
      heading: 'Heading should have minimum 3 characters',
      description: 'Description should be a string',
      public: 'Public should be a boolean',
      target_usernames: 'Target usernames should be an array',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
