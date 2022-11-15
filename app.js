'use strict';

const path = require('path');
const AutoLoad = require('@fastify/autoload');
const { addSchemas } = require('./lib/validation');

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

const WHITE_LIST = ['/sign-up'];

module.exports = async function (app, opts) {
  // validation
  await addSchemas(app);
  // auth
  app.addHook('onRequest', async (request, reply) => {
    try {
      if (!WHITE_LIST.includes(request.url)) await request.jwtVerify();
    } catch (err) {
      reply.send(err);
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
