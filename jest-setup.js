const { build, onTestEnd } = require('./lib/test-env');

module.exports = async () => {
  const app = await build();
  app.addHook('onClose', async app => onTestEnd(app));
  app.ready();
  globalThis.app = app;
};
