'use strict';

const path = require('path');
const AutoLoad = require('@fastify/autoload');
const { addSchemas } = require('./lib/validation');
const { Unauthorized } = require('./lib/errors');
const { WHITE_LIST } = require('./lib/constants');
const { handleAppError } = require('./lib/errors');

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

module.exports = async function (app, opts) {
  // validation
  await addSchemas(app);
  // auth
  app.addHook('preParsing', async (request, reply) => {
    try {
      if (!WHITE_LIST.includes(request.url)) {
        const { userId } = await request.jwtVerify();
        request.userId = userId;
      }
    } catch (error) {
      console.log('Auth Error:', error);
      const unauthorizedError = new Unauthorized();
      reply.statusCode = unauthorizedError.statusCode;
      reply.send(unauthorizedError);
    }
  });
  app.setErrorHandler(handleAppError);
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  });
};
