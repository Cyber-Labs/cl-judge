module.exports = {
  required: ['name', 'problem_statement'],
  properties: {
    type: {
      type: 'string',
      enum: ['mcq', 'subjective'],
    },
    name: {
      type: 'string',
    },
    problem_statement: {
      type: 'string',
    },
    input_format: {
      type: 'string',
    },
    output_format: {
      type: 'string',
    },
    constraints: {
      type: 'string',
    },
    options: {
      type: 'array',
      pattern: 'optionsPattern',
    },
    correct: {
      type: 'number',
    },
    difficulty: {
      type: 'string',
      enum: ['easy', 'medium', 'hard'],
    },
  },
  errorMessage: {
    required: {
      name: 'Question name required',
      problem_statement: 'Question problem statement required',
    },
    properties: {
      type: 'Invalid question type',
      name: 'Invalid question name',
      problem_statement: 'Invalid question problem statement',
      input_format: 'Invalid question input format',
      output_format: 'Invalid question output format',
      constraints: 'Invalid question constraints',
      options: 'Invalid question options',
      correct: 'Invalid question correct field',
      difficulty: 'Invalid question difficulty',
    },
    _: 'Invalid data',
  },
}
