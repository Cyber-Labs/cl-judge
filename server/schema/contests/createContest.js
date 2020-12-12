const schema = {
  required: ['name', 'show_leaderboard', 'public', 'start_time', 'end_time'],
  properties: {
    name: {
      type: 'string',
      minLength: 4,
    },
    show_leaderboard: {
      type: 'boolean',
    },
    public: {
      type: 'boolean',
    },
    confidential_questions: {
      type: 'boolean',
    },
    start_time: {
      type: 'string',
      format: 'dateTimeFormat',
    },
    end_time: {
      type: 'string',
      format: 'dateTimeFormat',
    },
    about: {
      type: 'string',
    },
    rules: {
      type: 'string',
    },
    prizes: {
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      name: 'Contest name required',
      show_leaderboard: 'show_leaderboard field required',
      public: 'public field required',
      start_time: 'Start time required',
      end_time: 'End time required',
    },
    properties: {
      name: 'Invalid contest name',
      show_leaderboard: 'Invalid show_leaderboard field',
      public: 'Invalid public field',
      confidential_questions: 'Invalid field confidential_questions',
      start_time: 'Invalid start time',
      end_time: 'Invalid end time',
      about: 'Invalid about',
      rules: 'Invalid rules',
      prizes: 'Invalid prizes',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
