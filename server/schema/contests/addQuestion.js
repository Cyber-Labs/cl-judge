const schema = {
  required: ['question_id', 'max_score'],
  properties: {
    question_id: {
      type: 'number',
    },
    max_score: {
      type: 'number',
    },
  },
  errorMessage: {
    required: {
      question_id: 'Question id required',
      max_score: 'Maximum score required',
    },
    properties: {
      question_id: 'Invalid question id',
      max_score: 'Invalid maximum score',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
