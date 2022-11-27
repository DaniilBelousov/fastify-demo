module.exports = {
  $id: 'sign-in',
  body: {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        minLength: 6,
        pattern: '(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{6,}'
      },
      email: {
        type: 'string',
        pattern:
          // source https://emailregex.com/
          '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
      }
    },
    required: ['password', 'email'],
    additionalProperties: false
  }
};
