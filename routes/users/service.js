'use strict';

const { randomUUID } = require('node:crypto');
const { TABLE_USERS } = require('../../lib/constants');
const CommonService = require('../../lib/service');

module.exports = class UsersService extends CommonService {
  constructor(app) {
    super(app);
  }

  async create(userData) {
    const Users = this.knex(TABLE_USERS);
    const id = randomUUID();
    await Users.insert({ id, ...userData });
  }

  async getList() {
    const Users = this.knex(TABLE_USERS);
    return Users.select('*');
  }
};
