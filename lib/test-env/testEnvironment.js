const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { build } = require('./app');

class FastifyEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    const app = await build();
    this.global.app = app;
    this.global.app.ready();
  }

  async teardown() {
    await super.teardown();
    await this.global.app.close();
  }
}

module.exports = FastifyEnvironment;
