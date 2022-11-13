'use strict';

const UsersService = require('./service');

module.exports = async function (app, _) {
  const Users = new UsersService(app);

  app.post('/', {
    async handler(request, reply) {
      const { body } = request;
      Users.create(body);
      reply.send(201);
    },
    schema: app.getSchema('create-users')
  });

  app.get('/', {
    async handler(request, reply) {
      const users = await Users.getList();
      console.log(users);
      reply.statusCode = 200;
      reply.send(users);
    },
    schema: app.getSchema('find-users')
  });
};
