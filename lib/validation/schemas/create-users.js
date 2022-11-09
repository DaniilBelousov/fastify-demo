module.exports = {
  $id: 'create-users',
  body: {
    type: 'object',
    properties: {
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
      'name',
      'lastName',
      'email',
      'phoneNumber',
      'privacyPolicyAccepted',
      'termsOfUseAccepted'
    ],
    additionalProperties: false
  }
};
