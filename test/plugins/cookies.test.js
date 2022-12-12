'use strict';

const Fastify = require('fastify');
const cookies = require('../../plugins/cookies');

const getValue = str => {
  const [_, value] = str.split('=');
  return value;
};

test('should successfully set up cookies plugin', async () => {
  const app = Fastify();
  app.register(cookies);

  const cookieData = 'test-cookie';
  const data = { data: 'test' };

  app.get('/test', (request, reply) => {
    reply.setCookie('test', cookieData).send(data);
  });

  const res = await app.inject({
    method: 'GET',
    url: '/test'
  });

  const cookie = res.headers['set-cookie'];

  expect(res.json()).toEqual(data);
  expect(getValue(cookie)).toEqual(cookieData);
});
