const { getConfig } = require('../../config');

const {
  users: { password }
} = getConfig('models');

module.exports = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    password: {
      type: 'string',
      pattern: '^[0-9a-fA-F]{32}:[0-9a-fA-F]{128}$'
    },
    email: {
      type: 'string',
      pattern:
        // source https://emailregex.com/
        '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    },
    name: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string'
    },
    privacyPolicyAccepted: {
      type: 'boolean'
    },
    termsOfUseAccepted: {
      type: 'boolean'
    }
  },
  required: [
    'id',
    'password',
    'email',
    'name',
    'lastName',
    'phoneNumber',
    'privacyPolicyAccepted',
    'termsOfUseAccepted'
  ],
  additionalProperties: false
};
