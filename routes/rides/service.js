'use strict';

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

  async find(userId) {
    return this.Rides.findMany(
      {
        where: { userId },
        select: '*',
        orderBy: ['date', 'desc']
      },
      { pagination: true }
    );
  }
}

module.exports = { Service };
