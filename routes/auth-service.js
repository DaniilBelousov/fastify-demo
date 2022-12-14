'use strict';

const { hash, verify } = require('../lib/hash');
const { getConfig } = require('../lib/config');
const { NotFound, Forbidden } = require('../lib/errors');
const {
  MESSAGE_ALREADY_EXISTS,
  MESSAGE_USER_NOT_FOUND,
  MESSAGE_INCORRECT_PASSWORD,
  MESSAGE_REFRESH_TOKEN_EXPIRED
} = require('../lib/constants');

class AuthService {
  constructor(app) {
    this.app = app;
    const {
      models: { Users, AuthTokens }
    } = this.app;
    this.Users = Users;
    this.AuthTokens = AuthTokens;
  }

  async signUp(userData) {
    const { email, password } = userData;
    const user = await this.Users.findMany({ where: { email }, first: true });
    if (user) throw new Forbidden(MESSAGE_ALREADY_EXISTS);
    const hashedPassword = await hash(password);
    const userId = await this.Users.create({ ...userData, password: hashedPassword });
    return await this.#createJwtTokens(userId);
  }

  async signIn({ email, password }) {
    const user = await this.Users.findMany({ where: { email }, first: true });
    if (!user) throw new NotFound(MESSAGE_USER_NOT_FOUND);
    const isValid = await verify(password, user.password);
    if (!isValid) throw new Forbidden(MESSAGE_INCORRECT_PASSWORD);
    return await this.#createJwtTokens(user.id);
  }

  async refresh({ refreshToken }) {
    const { userId, expiredAt } = (await this.AuthTokens.findOne(refreshToken)) || {};
    const now = new Date();
    if (!userId) throw new NotFound(MESSAGE_USER_NOT_FOUND);
    if (now > new Date(expiredAt)) throw new Forbidden(MESSAGE_REFRESH_TOKEN_EXPIRED);
    await this.AuthTokens.remove(refreshToken);
    return await this.#createJwtTokens(userId);
  }

  async #createJwtTokens(userId) {
    const { expiresIn } = getConfig('jwt');
    const TOKEN_EXPIRATION_MONTHS = 6;
    const date = new Date();
    date.setMonth(date.getMonth() + TOKEN_EXPIRATION_MONTHS);
    const expiredAt = date.toISOString().slice(0, 19).replace('T', ' ');
    const token = await this.app.jwt.sign(
      {
        userId
      },
      { expiresIn }
    );
    const refreshToken = await this.AuthTokens.create({ userId, expiredAt });
    return { token, refreshToken };
  }
}

module.exports = { AuthService };
