'use strict';

const { Service } = require('./service');

module.exports = async function (app, _) {
  const service = new Service(app);
  const {
    models: { Rides }
  } = app;

  app.get('/', {
    async handler(request, reply) {
      const rides = await service.find(request.userId);
      reply.statusCode = 200;
      reply.send(rides);
    },
    schema: app.getSchema('find-rides')
  });

  app.post('/', {
    async handler(request, reply) {
      await service.create(request.body);
      reply.statusCode = 201;
      reply.send({ status: 'OK' });
    },
    schema: app.getSchema('create-ride')
  });
};
