'use strict';

const { randomUUID } = require('node:crypto');
const CommonService = require('../lib/service');
const { TABLE_USERS, TABLE_AUTH_TOKENS } = require('../lib/constants');

class AuthService extends CommonService {
  constructor(app) {
    super(app);
  }

  async createUser(userData) {
    const Users = this.knex(TABLE_USERS);
    const id = randomUUID();
    await Users.insert({ id, ...userData });
    return id;
  }

  async createAuthToken(refreshToken, userId) {
    const AuthTokens = this.knex(TABLE_AUTH_TOKENS);
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    const expiredAt = date.toISOString().slice(0, 19).replace('T', ' ');
    await AuthTokens.insert({ refreshToken, userId, expiredAt });
  }

  async findRefreshToken(refreshToken) {
    const AuthTokens = this.knex(TABLE_AUTH_TOKENS);
    return AuthTokens.where({ refreshToken }).first();
  }

  async removeRefreshToken(refreshToken) {
    const AuthTokens = this.knex(TABLE_AUTH_TOKENS);
    return AuthTokens.where({ refreshToken }).del();
  }

  async findUser(email) {
    const Users = this.knex(TABLE_USERS);
    return Users.where({ email }).first();
  }
}

module.exports = {
  AuthService
};
