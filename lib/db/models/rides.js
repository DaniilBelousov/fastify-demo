'use strict';

const CommonModel = require('./common');
const { TABLE_RIDES } = require('../../constants');

module.exports = class Rides extends CommonModel {
  constructor(knex) {
    super(knex, TABLE_RIDES);
  }
};
