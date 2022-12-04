'use strict';

const { handleAjvError } = require('./handle-ajv-error');
const { CommonError } = require('./errors');

const handleAppError = (error, _, reply) => {
  console.log('App Error:', error);
  const nextError = handleAjvError(error);
  const statusCode = nextError.statusCode || 500;
  reply.statusCode = statusCode;
  if (statusCode === 500) {
    const systemError = new CommonError();
    reply.send(systemError);
  } else {
    reply.send(nextError);
  }
};

module.exports = {
  handleAppError
};
