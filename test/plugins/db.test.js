'use strict';

const Fastify = require('fastify');
const db = require('../../plugins/db');

test('should successfully set up db decorators', async () => {
  const app = Fastify();
  app.register(db);
  await app.ready();

  expect(app.knex).toBeDefined();
  expect(app.models.Users).toBeDefined();
  expect(Object.keys(app.models).length).toEqual(3);
});
