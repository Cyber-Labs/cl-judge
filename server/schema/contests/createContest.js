const schema = {
  required: [
    'contest_name',
    'show_leaderboard',
    'public',
    'confidential',
    'start_time',
    'end_time',
  ],
  properties: {
    contest_name: {
      type: 'string',
      minLength: 4,
    },
    creator: {
      type: 'string',
      minLength: 4,
    },
    show_leaderboard: {
      type: 'boolean',
    },
    public: {
      type: 'boolean',
    },
    confidential: {
      type: 'boolean',
    },
    start_time: {
      type: 'string',
      format: 'date-time',
    },
    end_time: {
      type: 'string',
      format: 'date-time',
    },
    participants_count: {
      type: 'number',
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
      contest_name: 'Contest name required',
      creator: 'Creator required',
      show_leaderboard: 'Leaderboard privacy required',
      public: 'Privacy required',
      confidential: 'Confidentiality required',
      start_time: 'Start time required',
      end_time: 'End time required',
    },
    properties: {
      contest_name: 'Invalid contest name',
      creator: 'Invalid creator',
      show_leaderboard: 'Invalid leaderboard privacy',
      public: 'Invalid privacy',
      confidential: 'Invalid confidentiality',
      start_time: 'Invalid start time',
      end_time: 'Invalid end time',
      participants_count: 'Invalid participants count',
      about: 'Invalid about',
      rules: 'Invalid rules',
      prizes: 'Invalid prizes',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
