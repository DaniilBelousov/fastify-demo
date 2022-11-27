'use strict';

const { TABLE_AUTH_TOKENS } = require('../../constants');
const CommonModel = require('./common');

module.exports = class AuthTokens extends CommonModel {
  constructor(knex) {
    super(knex, TABLE_AUTH_TOKENS);
  }

  async create(data) {
    const model = this.knex(this.table);
    const refreshToken = randomUUID();
    await model.insert({ ...data, refreshToken });
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
