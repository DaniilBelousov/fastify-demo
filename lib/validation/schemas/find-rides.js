module.exports = {
  $id: 'find-rides',
  response: {
    200: {
      content: {
        'application/json': {
          schema: {
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
                date: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};
