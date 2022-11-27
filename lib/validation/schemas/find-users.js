module.exports = {
  $id: 'find-users',
  response: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string' },
                lastName: { type: 'string' },
                privacyPolicyAccepted: { type: 'boolean' },
                termsOfUseAccepted: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  }
};
