'use strict';

const Fastify = require('fastify');
const jwt = require('../../plugins/jwt');

const regJwt = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/;

test('should successfully set up jwt plugin', async () => {
  const app = Fastify();
  app.register(jwt);

  app.get('/test', (request, reply) => {
    const token = app.jwt.sign({ userId: 'test_id' });
    reply.send({ token });
  });

  const res = await app.inject({
    method: 'GET',
    url: '/test'
  });

  expect(app.jwt).toBeDefined();
  expect(res.json().token).toEqual(expect.stringMatching(regJwt));
});
