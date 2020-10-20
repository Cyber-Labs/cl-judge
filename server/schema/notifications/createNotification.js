const schema = {
  required: ['heading', 'description', 'public', 'target_usernames'],
  properties: {
    heading: {
      type: 'string',
      minLength: 3,
    },
    description: {
      type: 'string',
      minLength: 8,
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
      description: 'Description required',
    },
    properties: {
      heading: 'Heading should have minimum 3 characters',
      description: 'Description should have minimum 8 characters',
      public: 'Public should be a boolean',
      target_usernames: 'Target usernames should be an array',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
