module.exports = {
  $id: 'refresh',
  body: {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string'
      }
    },
    required: ['refreshToken'],
    additionalProperties: false
  }
};
