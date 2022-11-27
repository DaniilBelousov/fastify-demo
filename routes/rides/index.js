'use strict';

module.exports = async function (app, _) {
  const {
    models: { Rides }
  } = app;

  app.get('/', {
    async handler(request, reply) {
      const userId = request.userId;
      const rides = await Rides.knexQuery().select('*').where({ userId });
      reply.statusCode = 200;
      reply.send(rides);
    },
    schema: app.getSchema('find-rides')
  });

  app.post('/', {
    async handler(request, reply) {
      const { date, options, payment, ...body } = request.body;
      const nextDate = date.slice(0, 19).replace('T', ' ');
      const userId = request.userId;
      const nextOptions = JSON.stringify(options);
      const nextPayment = JSON.stringify(payment);
      await Rides.create({
        ...body,
        date: nextDate,
        userId,
        options: nextOptions,
        payment: nextPayment
      });
      reply.statusCode = 201;
      reply.send({ status: 'OK' });
    },
    schema: app.getSchema('create-ride')
  });
};
