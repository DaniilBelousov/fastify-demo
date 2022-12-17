'use strict';

const {
  MESSAGE_INVALID_EMAIL,
  MESSAGE_INVALID_PASSWORD,
  MESSAGE_INVALID_ENUM,
  CODE_INVALID_EMAIL,
  CODE_INVALID_PASSWORD
} = require('../constants');
const { ValidationError } = require('./errors');

const ERROR_MAPPINGS = {
  email: { message: MESSAGE_INVALID_EMAIL, code: CODE_INVALID_EMAIL },
  password: { message: MESSAGE_INVALID_PASSWORD, code: CODE_INVALID_PASSWORD },
  enum: {
    message: MESSAGE_INVALID_ENUM,
    getValues: ({
      validation: [
        {
          params: { allowedValues }
        }
      ]
    }) => allowedValues.reduce((prev, curr) => `${prev}, ${curr}`)
  }
};

const handleAjvError = error => {
  const {
    validation: [{ keyword, instancePath, message: ajvMessage } = {}] = [],
    statusCode = 500
  } = error;
  if (!keyword || statusCode !== 400) return error;
  const field = keyword == 'enum' ? keyword : instancePath.split('/').pop();
  const { message = ajvMessage, code, getValues } = ERROR_MAPPINGS[field] || {};
  const nextMessage = getValues ? `${message} ${getValues(error)}` : message;
  return new ValidationError({ message: nextMessage, code });
};

module.exports = {
  handleAjvError
};
