'use strict';

const {
  CommonError,
  BadRequest,
  ValidationError,
  Unauthorized,
  Forbidden,
  NotFound,
  handleAppError
} = require('../index');
const { handleAjvError } = require('../handle-ajv-error');
const {
  CODE_SYSTEM_ERROR,
  CODE_BAD_REQUEST,
  CODE_UNAUTHORIZED,
  CODE_FORBIDDEN,
  CODE_NOT_FOUND,
  CODE_VALIDATION_ERROR,
  MESSAGE_SYSTEM_ERROR,
  MESSAGE_BAD_REQUEST,
  MESSAGE_UNAUTHORIZED,
  MESSAGE_FORBIDDEN,
  MESSAGE_NOT_FOUND,
  MESSAGE_VALIDAtiON_ERROR,
  ERROR_SYSTEM_ERROR,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND,
  ERROR_VALIDATION,
  MESSAGE_INVALID_EMAIL,
  CODE_INVALID_EMAIL
} = require('../../constants');

describe('possible errors', () => {
  test('should return CommonError', () => {
    const { code, message, error, statusCode } = new CommonError();

    expect(statusCode).toEqual(500);
    expect(code).toEqual(CODE_SYSTEM_ERROR);
    expect(message).toEqual(MESSAGE_SYSTEM_ERROR);
    expect(error).toEqual(ERROR_SYSTEM_ERROR);
  });

  test('should return BadRequest', () => {
    const { code, message, error, statusCode } = new BadRequest();

    expect(statusCode).toEqual(400);
    expect(code).toEqual(CODE_BAD_REQUEST);
    expect(message).toEqual(MESSAGE_BAD_REQUEST);
    expect(error).toEqual(ERROR_BAD_REQUEST);
  });

  test('should return ValidationError', () => {
    const { code, message, error, statusCode } = new ValidationError();

    expect(statusCode).toEqual(400);
    expect(code).toEqual(CODE_VALIDATION_ERROR);
    expect(message).toEqual(MESSAGE_VALIDAtiON_ERROR);
    expect(error).toEqual(ERROR_VALIDATION);
  });

  test('should return Unauthorized', () => {
    const { code, message, error, statusCode } = new Unauthorized();

    expect(statusCode).toEqual(401);
    expect(code).toEqual(CODE_UNAUTHORIZED);
    expect(message).toEqual(MESSAGE_UNAUTHORIZED);
    expect(error).toEqual(ERROR_UNAUTHORIZED);
  });

  test('should return Forbidden', () => {
    const { code, message, error, statusCode } = new Forbidden();

    expect(statusCode).toEqual(403);
    expect(code).toEqual(CODE_FORBIDDEN);
    expect(message).toEqual(MESSAGE_FORBIDDEN);
    expect(error).toEqual(ERROR_FORBIDDEN);
  });

  test('should return NotFound', () => {
    const { code, message, error, statusCode } = new NotFound();

    expect(statusCode).toEqual(404);
    expect(code).toEqual(CODE_NOT_FOUND);
    expect(message).toEqual(MESSAGE_NOT_FOUND);
    expect(error).toEqual(ERROR_NOT_FOUND);
  });
});

describe('handleAjvError', () => {
  test('should throw email validation error', () => {
    const errorData = {
      validation: [{ instancePath: '/body/email', keyword: 'pattern' }],
      statusCode: 400
    };
    const { code, message, error, statusCode } = handleAjvError(errorData);

    expect(statusCode).toEqual(400);
    expect(code).toEqual(CODE_INVALID_EMAIL);
    expect(message).toEqual(MESSAGE_INVALID_EMAIL);
    expect(error).toEqual(ERROR_VALIDATION);
  });

  test('should return ValidationError with initial message', () => {
    const initMessage = '123';
    const errorData = {
      validation: [
        { instancePath: '/body/field', keyword: 'type', message: initMessage }
      ],
      statusCode: 400
    };
    const { code, message, error, statusCode } = handleAjvError(errorData);

    expect(statusCode).toEqual(400);
    expect(code).toEqual(CODE_VALIDATION_ERROR);
    expect(message).toEqual(initMessage);
    expect(error).toEqual(ERROR_VALIDATION);
  });

  test('should return initial error', () => {
    const errorData = {};
    const error = handleAjvError(errorData);

    expect(error).toEqual({});
  });
});

describe('handleAppError', () => {
  test('should return NotFound error', () => {
    let res;
    const reply = {
      statusCode: undefined,
      send: i => {
        res = i;
      }
    };
    const error = new NotFound();

    handleAppError(error, {}, reply);

    expect(res.statusCode).toEqual(404);
    expect(res.code).toEqual(CODE_NOT_FOUND);
    expect(res.message).toEqual(MESSAGE_NOT_FOUND);
    expect(res.error).toEqual(ERROR_NOT_FOUND);
  });

  test('should return CommonError error', () => {
    let res;
    const reply = {
      statusCode: undefined,
      send: i => {
        res = i;
      }
    };
    handleAppError({}, {}, reply);

    expect(res.statusCode).toEqual(500);
    expect(res.code).toEqual(CODE_SYSTEM_ERROR);
    expect(res.message).toEqual(MESSAGE_SYSTEM_ERROR);
    expect(res.error).toEqual(ERROR_SYSTEM_ERROR);
  });
});
