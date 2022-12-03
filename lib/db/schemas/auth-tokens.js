module.exports = {
  type: 'object',
  properties: {
    refreshToken: { type: 'string' },
    userId: { type: 'string' },
    expiredAt: { type: 'string' }
  },
  required: ['refreshToken', 'userId', 'expiredAt'],
  additionalProperties: false
};
