const schema = {
  required: ['score'],
  properties: {
    score: {
      type: 'number',
    },
    feedback: {
      type: 'string',
    },
  },
  errorMessage: {
    properties: {
      score: 'Score should be a number',
      feedback: 'Invalid feedback',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
