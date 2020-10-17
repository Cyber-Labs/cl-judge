const schema = {
  required: [
    'username',
    'password',
    'full_name',
    'admission_number',
    'email',
    'admission_year',
    'department',
    'course',
  ],
  properties: {
    username: { type: 'string', minLength: 4 },
    password: { type: 'string', format: 'password' },
    full_name: { type: 'string' },
    admission_number: {
      type: 'string',
      minLength: 8,
      maxLength: 8,
      pattern: '^[0-9]{2}[a-z]{2}[0-9]{4}$',
    },
    email: {
      type: 'string',
      pattern: '^[a-z]+.[0-9]{2}[a-z]{2}[0-9]{4}@([a-z]{2,4}.)?iitism.ac.in$',
    },
    admission_year: {
      type: 'number',
    },
    department: {
      type: 'number',
      minimum: 0,
      maximum: 14,
    },
    course: {
      type: 'number',
      minimum: 0,
      maximum: 4,
    },
  },
  errorMessage: {
    required: {
      username: 'Username requried',
      password: 'Password required',
      full_name: 'Name required',
      admission_number: 'Admission Number required',
      email: 'Email required',
      admission_year: 'Admission Year required',
      department: 'Department required',
      course: 'Course required',
    },
    properties: {
      username: 'Invalid username',
      password: 'Invalid password',
      full_name: 'Invalid name',
      admission_number: 'Invalid admission number',
      email: 'Invlalid email',
      admission_year: 'Invalid admission year',
      department: 'Invalid department',
      course: 'Invalid course',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
