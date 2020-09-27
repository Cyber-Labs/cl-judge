const schema = {
  required: ['username', 'password', 'full_name', 'admission_number', 'email', 'mobile'],
  properties: {
    username: { type: 'string', minLength: 4 },
    password: { type: 'string', format: 'password' },
    full_name: { type: 'string' },
    admission_number: {
      type: 'string',
      minLength: 8,
      maxLength: 8,
      pattern: '^[0-9]{2}[a-z]{2}[0-9]{4}$'
    },
    email: {
      type: 'string',
      pattern:
        '^[a-z]+\\.[0-9]{2}[a-z]{2}[0-9]{4}@([a-z].\\.)?iitism\\.ac\\.in$'
    },
    mobile: {
      type: 'string',
      minLength: 10,
      maxlength: 10,
      pattern: '^[0-9]{10}$'
    }
  },
  errorMessage: {
    required: {
      username: 'Username requried',
      password: 'Password required',
      full_name: 'Name required',
      admission_number: 'Admission Number required',
      email: 'Email required',
      mobile: 'Mobile Number required',
    },
    properties: {
      username: 'Invalid username',
      password: 'Invalid password',
      full_name: 'Invalid name',
      admission_number: 'Invalid admission number',
      email: 'Invlalid email',
      mobile: 'Invalid mobile number'
    },
    _: 'Invalid data'
  }
};

module.exports = schema;
