const schema = {
  required: ['max_score'],
  properties: {
    max_score: {
      type: 'number',
    },
  },
  errorMessage: {
    required: {
      max_score: 'Maximum score required',
    },
    properties: {
      max_score: 'Invalid maximum score',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
