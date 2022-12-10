const { clearTestData } = require('./lib/test-env');

module.exports = async () => {
  await clearTestData(globalThis.app, { destroy: true });
  await globalThis.app.close();
};
