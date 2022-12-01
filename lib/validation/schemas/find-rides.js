module.exports = {
  $id: 'find-rides',
  response: {
    200: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              limit: { type: 'integer' },
              page: { type: 'integer' },
              data: {
                type: 'array',
                items: {
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
                    count: { type: 'integer' },
                    options: { type: 'array' },
                    payment: { type: 'array' },
                    price: { type: 'integer' },
                    date: { type: 'string' },
                    userId: { type: 'string' },
                    name: { type: 'string' },
                    lastName: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  querystring: {
    type: 'object',
    properties: {
      from: { type: 'string' },
      to: { type: 'string' },
      sort: { type: 'string' }
    }
  }
};
