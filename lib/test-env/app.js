'use strict';

const fastify = require('fastify');
const buildApp = require('../../app');

async function build() {
  const app = fastify();
  await buildApp(app, {});
  return app;
}

module.exports = { build };
