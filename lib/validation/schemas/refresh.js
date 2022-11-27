module.exports = {
  $id: 'refresh',
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'refreshToken'
      }
    },
    required: ['refreshToken'],
    additionalProperties: false
  }
};
