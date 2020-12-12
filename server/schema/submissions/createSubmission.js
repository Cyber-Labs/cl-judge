const schema = {
  required: ['user_submission', 'output', 'submission_time'],
  properties: {
    user_submission: {
      type: 'string',
    },
    output: {
      type: 'string',
    },
    submission_time: {
      type: 'object',
      format: 'date-time',
    },
  },
  errorMessage: {
    required: {
      user_submission: 'User submission required',
      output: 'Output required',
      submission_time: 'Submission time required',
    },
    properties: {
      user_submission: 'Invalid user submission',
      output: 'Invalid output',
      submission_time: 'Invalid submission time',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
