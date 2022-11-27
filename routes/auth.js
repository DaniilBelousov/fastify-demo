'use strict';

const { hash, verify } = require('../lib/hash');
const { getConfig } = require('../lib/config');

module.exports = async function (app, opts) {
  const {
    models: { AuthTokens, Users }
  } = app;

  const createJwtTokens = async userId => {
    const { expiresIn } = getConfig('jwt');
    const TOKEN_EXPIRATION_MONTHS = 6;
    const date = new Date();
    date.setMonth(date.getMonth() + TOKEN_EXPIRATION_MONTHS);
    const expiredAt = date.toISOString().slice(0, 19).replace('T', ' ');
    const token = await app.jwt.sign(
      {
        userId
      },
      { expiresIn }
    );
    const refreshToken = await AuthTokens.create({ refreshToken, userId, expiredAt });
    return { token, refreshToken };
  };

  app.post('/sign-up', {
    async handler(request, reply) {
      const body = request.body;
      const hashedPassword = await hash(body.password);
      const userId = await Users.create({ ...body, password: hashedPassword });
      const { token, refreshToken } = await createJwtTokens(userId);
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
      const user = await Users.knexQuery().where({ email }).first();
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
      const { userId } = await AuthTokens.findOne(refreshToken);
      if (!userId) {
        reply.notFound();
      }
      await AuthTokens.remove(refreshToken);
      reply.statusCode = 201;
      return await createJwtTokens(userId);
    },
    schema: app.getSchema('refresh')
  });
};
