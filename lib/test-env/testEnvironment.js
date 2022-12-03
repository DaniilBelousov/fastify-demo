const NodeEnvironment = require('jest-environment-node').TestEnvironment;
const { build } = require('./app');

class FastifyEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    this.global.app = await build();
  }

  async teardown() {
    await super.teardown();
    await this.global.app.close();
  }
}

module.exports = FastifyEnvironment;
