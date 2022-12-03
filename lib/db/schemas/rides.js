const { getConfig } = require('../../config');

const {
  rides: { count, price }
} = getConfig('models');

module.exports = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    userId: { type: 'string' },
    fromLocation: { type: 'string' },
    toLocation: { type: 'string' },
    fromRegion: { type: 'string' },
    toRegion: { type: 'string' },
    fromAddress: { type: 'string' },
    toAddress: { type: 'string' },
    comment: { type: 'string' },
    count: {
      type: 'integer',
      minimum: count.minimum,
      maximum: count.maximum
    },
    options: { type: 'string' },
    payment: { type: 'string' },
    price: {
      type: 'integer',
      minimum: price.minimum,
      maximum: price.maximum
    },
    date: { type: 'string' }
  },
  required: [
    'id',
    'userId',
    'fromLocation',
    'toLocation',
    'fromAddress',
    'toAddress',
    'fromRegion',
    'toRegion',
    'count',
    'comment',
    'price',
    'payment',
    'options',
    'date'
  ],
  additionalProperties: false
};
