'use strict';

const { hash, verify } = require('../lib/hash');
const { getConfig } = require('../lib/config');
const { NotFound, Forbidden } = require('../lib/errors');

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
    if (user) throw new Forbidden('User already exists');
    const hashedPassword = await hash(password);
    const userId = await this.Users.create({ ...userData, password: hashedPassword });
    return await this.#createJwtTokens(userId);
  }

  async signIn({ email, password }) {
    const user = await this.Users.knexQuery().where({ email }).first();
    if (!user) throw new NotFound('User not found');
    const isValid = await verify(password, user.password);
    if (!isValid) throw new Forbidden('Incorrect password');
    return await this.#createJwtTokens(user.id);
  }

  async refresh({ refreshToken }) {
    const { userId, expiredAt } = (await this.AuthTokens.findOne(refreshToken)) || {};
    const now = new Date();
    if (!userId) throw new NotFound('User not found');
    if (now > new Date(expiredAt)) throw new Forbidden('Refresh token has been expired');
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
