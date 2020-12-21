const schema = {
  required: ['question_id'],
  properties: {
    question_id: {
      type: 'number',
    },
  },
  errorMessage: {
    required: {
      question_id: 'Question id required',
    },
    properties: {
      question_id: 'Invalid question id',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
