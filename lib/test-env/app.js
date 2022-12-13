'use strict';

const fastify = require('fastify');
const buildApp = require('../../app');
const { clearTestData } = require('./helpers');

const initTestApp = async () => {
  const app = fastify();
  await buildApp(app, {});
  app.addHook('onClose', async ({ knex }) => {
    await knex.destroy();
  });
  await app.ready();
  await clearTestData(app);
  return app;
};

module.exports = { initTestApp };
