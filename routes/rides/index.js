'use strict';

const { Service } = require('./service');
const { transformQuery } = require('../../lib/hooks');

module.exports = async function (app, _) {
  const service = new Service(app);

  app.get('/', {
    async handler(request, reply) {
      const rides = await service.find(request.sqlQuery);
      reply.statusCode = 200;
      reply.send(rides);
    },
    schema: app.getSchema('find-rides'),
    preHandler: transformQuery('rides-query')
  });

  app.post('/', {
    async handler(request, reply) {
      const { userId, body } = request;
      await service.create(userId, body);
      reply.statusCode = 201;
      reply.send({ status: 'OK' });
    },
    schema: app.getSchema('create-ride')
  });
};
