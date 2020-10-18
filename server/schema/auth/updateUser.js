const schema = {
  properties: {
    email: {
      type: 'string',
      pattern: '^[a-z]+.[0-9]{2}[a-z]{2}[0-9]{4}@([a-z]{2,4}.)?iitism.ac.in$',
    },
    full_name: { type: 'string' },
    admission_number: {
      type: 'string',
      minLength: 8,
      maxLength: 8,
      pattern: '^[0-9]{2}[a-z]{2}[0-9]{4}$',
    },
    mobile: {
      type: 'string',
      minLength: 10,
      maxLength: 10,
      pattern: '^[0-9]{10}$',
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
    bio: {
      type: 'string',
      maxLength: 100,
    },
    admission_year: {
      type: 'number',
    },
  },
  errorMessage: {
    properties: {
      email: 'Invlalid email',
      full_name: 'Invalid name',
      admission_number: 'Invalid admission number',
      mobile: 'Invalid mobile number',
      department: 'Invalid department',
      course: 'Invalid course',
      bio: 'Invalid bio',
      admission_year: 'Invalid admission year',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
