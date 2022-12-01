'use strict';

const {
  CODE_SYSTEM_ERROR,
  CODE_BAD_REQUEST,
  CODE_UNAUTHORIZED,
  CODE_FORBIDDEN,
  CODE_NOT_FOUND,
  MESSAGE_SYSTEM_ERROR,
  MESSAGE_BAD_REQUEST,
  MESSAGE_UNAUTHORIZED,
  MESSAGE_FORBIDDEN,
  MESSAGE_NOT_FOUND,
  ERROR_SYSTEM_ERROR,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND
} = require('../constants');

class CommonError {
  constructor({ message, code, statusCode, error } = {}) {
    this.message = message || MESSAGE_SYSTEM_ERROR;
    this.statusCode = statusCode || 500;
    this.code = code || CODE_SYSTEM_ERROR;
    this.error = error || ERROR_SYSTEM_ERROR;
  }
}

class BadRequest extends CommonError {
  constructor(message) {
    super({
      message: message || MESSAGE_BAD_REQUEST,
      code: CODE_BAD_REQUEST,
      statusCode: 400,
      error: ERROR_BAD_REQUEST
    });
  }
}

class Unauthorized extends CommonError {
  constructor(message) {
    super({
      message: message || MESSAGE_UNAUTHORIZED,
      code: CODE_UNAUTHORIZED,
      statusCode: 401,
      error: ERROR_UNAUTHORIZED
    });
  }
}

class Forbidden extends CommonError {
  constructor(message) {
    super({
      message: message || MESSAGE_FORBIDDEN,
      code: CODE_FORBIDDEN,
      statusCode: 403,
      error: ERROR_FORBIDDEN
    });
  }
}

class NotFound extends CommonError {
  constructor(message) {
    super({
      message: message || MESSAGE_NOT_FOUND,
      code: CODE_NOT_FOUND,
      statusCode: 404,
      error: ERROR_NOT_FOUND
    });
  }
}

module.exports = {
  CommonError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound
};
