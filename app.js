'use strict';

const path = require('path');
const AutoLoad = require('@fastify/autoload');
const { addSchemas } = require('./lib/validation');
const { WHITE_LIST } = require('./lib/constants');

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
    } catch (err) {
      console.log(err);
      reply.unauthorized();
    }
  });
  // error handler
  app.setErrorHandler(function (error, request, reply) {
    // Log error
    this.log.error(error);
    // Send error response
    reply.status(500).send({ message: error });
  });
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
