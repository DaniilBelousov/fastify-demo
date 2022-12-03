'use strict';

const { build: buildApplication } = require('fastify-cli/helper');
const AppPath = `${__dirname}/../../app.js`;

async function build() {
  const argv = [AppPath];
  const app = await buildApplication(argv, {});
  return app;
}

module.exports = { build };
