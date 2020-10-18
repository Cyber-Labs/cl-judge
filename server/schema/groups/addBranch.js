const schema = {
  required: ['group_id', 'department', 'course', 'admission_year'],
  properties: {
    group_id: {
      type: 'string',
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
    admission_year: {
      type: 'number',
    },
  },
  errorMessage: {
    required: {
      group_id: 'Group Id required',
      department: 'Department required',
      course: 'Course required',
      admission_year: 'Admission year required',
    },
    properties: {
      group_id: 'Invalid group Id',
      department: 'Invalid department',
      course: 'Invalid course',
      admission_year: 'Invalid admission year',
    },
    _: 'Invalid data',
  },
}

module.exports = schema
