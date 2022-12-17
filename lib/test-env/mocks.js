'use strict';

const { getConfig } = require('../config');
const { randomUUID } = require('crypto');

class MockService {
  constructor(app) {
    this.app = app;
    this.models = app.models;
  }

  async mockDbData(dataToMock = []) {
    let mockData = {};
    for await (const { model: modelName, name, data = [], count } of dataToMock) {
      const model = this.models[modelName];
      if (!model) {
        throw new Error(`No such model ${modelName}`);
      }
      const nextData = await Promise.all(
        data.map(async data => {
          const randomMock = this.#getRandomMock(modelName);
          const creationData = { ...randomMock, ...data };
          await model.knexQuery().insert(creationData);
          return creationData;
        })
      );
      mockData = { ...mockData, [name]: nextData };
    }
    return mockData;
  }

  async mockJwtTokens(userId) {
    const { expiresIn } = getConfig('jwt');
    const refreshToken = randomUUID();
    const token = await this.app.jwt.sign(
      {
        userId
      },
      { expiresIn }
    );
    return { token, refreshToken };
  }

  #getRandomMock(model) {
    const mocks = require(`${__dirname}/mocks/${model}`);
    const len = mocks.length;
    const randomInt = Math.floor(Math.random() * len);
    const mock = mocks[randomInt];
    return mock.id ? { ...mock, id: randomUUID() } : mock;
  }
}

module.exports = {
  MockService
};
