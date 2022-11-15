'use strict';

const UsersService = require('./users/service');
const { hash, verify } = require('../lib/hash');

module.exports = async function (app, opts) {
  const Users = new UsersService(app);

  app.post('/sign-up', {
    async handler(request, reply) {
      const body = request.body;
      const hashedPassword = await hash(body.password);
      await Users.create({ ...body, password: hashedPassword });
      reply.statusCode = 201;
    },
    schema: app.getSchema('sign-up')
  });
};
