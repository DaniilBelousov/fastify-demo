'use strict';

const Ajv = require('ajv');

const ajv = new Ajv();

const compileSchema = schema => ajv.compile(schema);

module.exports = {
  compileSchema
};
