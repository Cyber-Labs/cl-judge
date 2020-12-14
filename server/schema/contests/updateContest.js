module.exports = {
  anyOf: [
    {
      required: ['name'],
    },
    {
      required: ['show_leaderboard'],
    },
    {
      required: ['public'],
    },
    {
      required: ['start_time'],
    },
    {
      required: ['end_time'],
    },
    {
      required: ['about'],
    },
    {
      required: ['rules'],
    },
    {
      required: ['prizes'],
    },
    {
      required: ['confidential_questions'],
    },
  ],
  not: {
    required: ['creator', 'id'],
  },
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
      creator: 'Contest creator cannot be updated',
      id: 'Contest id cannot be updated',
      confidential_questions:
        'Atleast one of the fields is required to update contest',
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
