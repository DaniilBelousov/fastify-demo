'use strict';

const { TABLE_USERS, TABLE_RIDES } = require('../../lib/constants');

class Service {
  constructor(app) {
    this.app = app;
    const {
      models: { Rides }
    } = app;
    this.Rides = Rides;
  }

  async create(userId, rideData) {
    const { date, options, payment, ...rest } = rideData;
    const nextDate = date.slice(0, 19).replace('T', ' ');
    const nextOptions = JSON.stringify(options);
    const nextPayment = JSON.stringify(payment);
    await this.Rides.create({
      ...rest,
      date: nextDate,
      userId,
      options: nextOptions,
      payment: nextPayment
    });
  }

  async find(query) {
    const USERS_ID = `${TABLE_USERS}.id`;
    const RIDES_USER_ID = `${TABLE_RIDES}.userId`;
    return this.Rides.findMany(
      {
        ...query,
        select: [
          `${TABLE_RIDES}.*`,
          `${TABLE_USERS}.id as userId`,
          `${TABLE_USERS}.name`,
          `${TABLE_USERS}.lastName`
        ],
        join: [TABLE_USERS, USERS_ID, RIDES_USER_ID]
      },
      { pagination: true }
    );
  }
}

module.exports = { Service };
