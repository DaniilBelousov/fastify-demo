'use strict';

const CommonModel = require('./common');
const { TABLE_USERS } = require('../../constants');

module.exports = class Users extends CommonModel {
  constructor(knex) {
    super(knex, TABLE_USERS, 'users');
  }
};
