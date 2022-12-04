'use strict';

const {
  MESSAGE_INVALID_EMAIL,
  MESSAGE_INVALID_PASSWORD,
  CODE_INVALID_EMAIL,
  CODE_INVALID_PASSWORD
} = require('../constants');
const { ValidationError } = require('./errors');

const ERROR_MAPPINGS = {
  email: { message: MESSAGE_INVALID_EMAIL, code: CODE_INVALID_EMAIL },
  password: { message: MESSAGE_INVALID_PASSWORD, code: CODE_INVALID_PASSWORD }
};

const handleAjvError = error => {
  const {
    validation: [{ keyword, instancePath, message: ajvMessage } = {}] = [],
    statusCode
  } = error;
  if (!keyword || statusCode !== 400) return error;
  const field = instancePath.split('/').pop();
  const { message = ajvMessage, code } = ERROR_MAPPINGS[field] || {};
  return new ValidationError({ message, code });
};

module.exports = {
  handleAjvError
};
