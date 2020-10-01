const schema = {
  required: ['username'],
  properties: {
    username: { type: 'string', minLength: 4 },
    email: {
      type: 'string'
      // pattern: '^[a-z]+\\.[0-9]{2}[a-z]{2}[0-9]{4}@([a-z].\\.)?iitism\\.ac\\.in$'
    },
    full_name: { type: 'string' },
    admission_number: {
      type: 'string',
      minLength: 8,
      maxLength: 8,
      pattern: '^[0-9]{2}[a-z]{2}[0-9]{4}$'
    },
    mobile: {
      type: 'string',
      minLength: 10,
      maxLength: 10,
      pattern: '^[0-9]{10}$'
    }
  },
  errorMessage: {
    required: {
      username: 'Username requried'
    },
    properties: {
      username: 'Invalid username',
      email: 'Invlalid email',
      full_name: 'Invalid name',
      admission_number: 'Invalid Admission number',
      mobile: 'Invalid mobile number'
    },
    _: 'Invalid data'
  }
}

module.exports = schema
