module.exports = {
  $id: 'sign-up',
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        minLength: 6,
        pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,}'
      },
      email: {
        type: 'string'
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
