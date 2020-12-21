const schema = {
  oneOf: [
    { required: ['subjective_submission'] },
    { required: ['mcq_submission'] },
  ],
  properties: {
    subjective_submission: {
      type: 'string',
    },
    mcq_submission: {
      type: 'integer',
    },
  },
  errorMessage: {
    properties: {
      subjective_submission: 'Invalid subjective submission',
      mcq_submission: 'Invalid MCQ submission',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
