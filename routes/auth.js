'use strict';

const { AuthService } = require('./auth-service');

module.exports = async function (app, opts) {
  const service = new AuthService(app);

  app.post('/sign-up', {
    async handler(request, reply) {
      const body = request.body;
      const { token, refreshToken } = await service.signUp(body);
      reply.setCookie('token', token, {
        path: '/'
      });
      reply.setCookie('refreshToken', refreshToken, {
        path: '/'
      });
      reply.statusCode = 201;
      reply.send({ status: 'OK' });
    },
    schema: app.getSchema('sign-up')
  });

  app.post('/sign-in', {
    async handler(request, reply) {
      const { email, password } = request.body;
      const service = new AuthService(app);
      const { token, refreshToken } = await service.signIn({ email, password });
      reply.setCookie('token', token, {
        path: '/'
      });
      reply.setCookie('refreshToken', refreshToken, {
        path: '/'
      });
      reply.statusCode = 201;
      reply.send({ status: 'OK' });
    },
    schema: app.getSchema('sign-in')
  });

  app.post('/refresh', {
    async handler(request, reply) {
      const { refreshToken } = request.body;
      const tokens = await service.refresh({ refreshToken });
      reply.setCookie('token', tokens.token, {
        path: '/'
      });
      reply.setCookie('refreshToken', tokens.refreshToken, {
        path: '/'
      });
      reply.statusCode = 201;
      reply.send(tokens);
    },
    schema: app.getSchema('refresh')
  });
};
