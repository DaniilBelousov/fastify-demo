module.exports = {
  $id: 'create-ride',
  body: {
    type: 'object',
    properties: {
      fromLocation: { type: 'string' },
      toLocation: { type: 'string' },
      fromRegion: { type: 'string' },
      toRegion: { type: 'string' },
      fromAddress: { type: 'string' },
      toAddress: { type: 'string' },
      comment: { type: 'string' },
      count: {
        type: 'integer',
        minimum: 1,
        maximum: 4
      },
      options: {
        type: 'array',
        items: {
          enum: ['option']
        }
      },
      payment: {
        type: 'array',
        items: {
          enum: ['payment']
        }
      },
      price: {
        type: 'integer',
        minimum: 0,
        maximum: 10000
      },
      date: { type: 'string' }
    },
    required: [
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
  }
};
