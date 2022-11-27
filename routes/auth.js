'use strict';

const { randomUUID } = require('node:crypto');
const { hash, verify } = require('../lib/hash');
const { AuthService } = require('./auth-service');
const { getConfig } = require('../lib/config');

module.exports = async function (app, opts) {
  const service = new AuthService(app);
  const { expiresAt } = getConfig('jwt');

  const createJwtTokens = async userId => {
    const token = await app.jwt.sign(
      {
        userId
      },
      { expiresIn: expiresAt }
    );
    const refreshToken = randomUUID();
    await service.createAuthToken(refreshToken, userId);
    return { token, refreshToken };
  };

  app.post('/sign-up', {
    async handler(request, reply) {
      const body = request.body;
      const hashedPassword = await hash(body.password);
      const userId = await service.createUser({ ...body, password: hashedPassword });
      const { token, refreshToken } = await createJwtTokens(userId);
      await service.createAuthToken(refreshToken, userId);
      reply.setCookie('token', token, {
        path: '/'
      });
      reply.setCookie('refreshToken', refreshToken, {
        path: '/'
      });
      reply.statusCode = 201;
    },
    schema: app.getSchema('sign-up')
  });

  app.post('/sign-in', {
    async handler(request, reply) {
      const { email, password } = request.body;
      const user = await service.findUser(email);
      if (!user) reply.notFound();
      const [_, userPassword] = user.password.split(':');
      await verify(password, userPassword).catch(() =>
        reply.badRequest('Incorrect password')
      );
      const { token, refreshToken } = await createJwtTokens(user.id);
      reply.setCookie('token', token, {
        path: '/'
      });
      reply.setCookie('refreshToken', refreshToken, {
        path: '/'
      });
      reply.statusCode = 201;
    },
    schema: app.getSchema('sign-in')
  });

  app.post('/refresh', {
    async handler(request, reply) {
      const { refreshToken } = request.body;
      const { userId } = await service.findRefreshToken(refreshToken);
      if (!userId) {
        reply.notFound();
      }
      await service.removeRefreshToken(refreshToken);
      reply.statusCode = 201;
      return await createJwtTokens(userId);
    },
    schema: app.getSchema('refresh')
  });
};
