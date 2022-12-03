const { getConfig } = require('../../config');

const {
  users: { password }
} = getConfig('models');

module.exports = {
  $id: 'sign-up',
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        minLength: password.minLength,
        pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,}'
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
      'password',
      'email',
      'name',
      'lastName',
      'phoneNumber',
      'privacyPolicyAccepted',
      'termsOfUseAccepted'
    ],
    additionalProperties: false
  }
};
