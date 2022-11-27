'use strict';

module.exports = async function (app, _) {
  const {
    models: { Users }
  } = app;

  app.get('/', {
    async handler(request, reply) {
      const users = await Users.knexQuery().select('*');
      reply.statusCode = 200;
      reply.send(users);
    },
    schema: app.getSchema('find-users')
  });
};
