module.exports = {
  required: ['reader'],
  properties: {
    reader: {
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      reader: 'Reader required',
    },
    properties: {
      reader: 'Invalid field Reader',
    },
    _: 'Invalid data',
  },
}
