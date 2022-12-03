'use strict';

const { randomUUID } = require('node:crypto');
const { TABLE_AUTH_TOKENS } = require('../../constants');
const CommonModel = require('./common');

module.exports = class AuthTokens extends CommonModel {
  constructor(knex) {
    super(knex, TABLE_AUTH_TOKENS, 'auth-tokens');
  }

  async create(data) {
    const model = this.knex(this.table);
    const refreshToken = randomUUID();
    const nextData = { ...data, refreshToken };
    if (this.validate) {
      const valid = this.validate(nextData);
      if (!valid) {
        const [{ message, instancePath }] = this.validate.errors;
        console.log(this.validate.errors);
        throw new Error(`${instancePath} ${message}`);
      }
    }
    await model.insert(nextData);
    return refreshToken;
  }

  async findOne(refreshToken) {
    const model = this.knex(this.table);
    return model.where({ refreshToken }).first();
  }

  async remove(refreshToken) {
    const model = this.knex(this.table);
    return model.where({ refreshToken }).del();
  }
};
