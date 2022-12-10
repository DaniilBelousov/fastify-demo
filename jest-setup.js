const { build, clearTestData } = require('./lib/test-env');

module.exports = async () => {
  const app = await build();
  app.addHook('onClose', async ({ knex }) => {
    await knex.destroy();
  });
  globalThis.app = app;
  await clearTestData(globalThis.app);
  globalThis.app.ready();
};
