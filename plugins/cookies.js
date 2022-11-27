'use strict';

const fp = require('fastify-plugin');

const { COOKIE_SECRET } = process.env;

module.exports = fp(async function (app, opts) {
  app.register(require('@fastify/cookie'), {
    secret: COOKIE_SECRET
  });
});
