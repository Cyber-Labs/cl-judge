module.exports = {
  required: ['editor'],
  properties: {
    editors: {
      type: 'string',
    },
  },
  errorMessage: {
    required: {
      editor: 'Editor required',
    },
    properties: {
      editor: 'Invalid field editor',
    },
    _: 'Invalid data',
  },
}
