'use strict';

const { handleAppError } = require('./handle-app-error');

module.exports = {
  ...require('./errors'),
  handleAppError
};
