const { transformQuery } = require('../index');

describe('transformQuery', () => {
  test('should successfully transform where query', () => {
    const userId = '1';
    const from = 'Moscow';
    const request = { userId, query: { from } };
    const transform = transformQuery('rides-query', { byUserId: true });
    transform(request);

    expect(request.sqlQuery).toEqual({ where: { fromLocation: from, userId } });
  });

  test('should successfully transform sort query', () => {
    const sort = 'date';
    const request = { query: { sort } };
    const transform = transformQuery('rides-query');
    transform(request);

    expect(request.sqlQuery).toEqual({ orderBy: ['date', 'desc'] });
  });

  test('should successfully transform empty query', () => {
    const request = { query: undefined };
    const transform = transformQuery('rides-query');
    transform(request);

    expect(request.sqlQuery).toEqual({});
  });

  test('should successfully transform query with wrong input', () => {
    const request = { query: { trash: '123' } };
    const transform = transformQuery('rides-query');
    transform(request);

    expect(request.sqlQuery).toEqual({});
  });
});
