module.exports = {
  anyOf: [
    {
      required: ['type'],
    },
    {
      required: ['name'],
    },
    {
      required: ['problem_statement'],
    },
    {
      required: ['input_format'],
    },
    {
      required: ['output_format'],
    },
    {
      required: ['constraints'],
    },
    {
      required: ['options'],
    },
    {
      required: ['correct'],
    },
    {
      required: ['tags'],
    },
    {
      required: ['difficulty'],
    },
  ],
  properties: {
    type: {
      type: 'string',
      enum: ['mcq', 'subjective', null],
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
      pattern: 'arrPattern',
    },
    correct: {
      type: 'number',
    },
    difficulty: {
      type: 'string',
      enum: ['easy', 'medium', 'hard', null],
    },
    tags: {
      type: 'array',
      pattern: 'arrPattern',
    },
  },
  errorMessage: {
    properties: {
      type: 'Invalid question type',
      name: 'Invalid question name',
      problem_statement: 'Invalid question problem statement',
      inputFormat: 'Invalid question input format',
      output_format: 'Invalid question output format',
      constraints: 'Invalid question constraints',
      options: 'Invalid question options',
      correct: 'Invalid question correct field',
      difficulty: 'Invalid question difficulty',
      tags: 'Invalid field types',
    },
    _: 'Invalid data',
  },
}
