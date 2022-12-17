'use strict';

const { CODE_VALIDATION_ERROR } = require('../../lib/constants');
const { MockService, initTestApp } = require('../../lib/test-env');
const { MESSAGE_INVALID_ENUM, TABLE_USERS, TABLE_RIDES } = require('../../lib/constants');

let app, service, user1Token, user2Token;
let mockData = {};

const FROM_MOSCOW = 'Moscow';
const TO_SAINT_P = 'Saint-Petersburg';

const getKeys = obj => Object.keys(obj).sort();
const toTimestamp = date => date.toISOString().slice(0, 19).replace('T', ' ');

beforeAll(async () => {
  app = await initTestApp();
  service = new MockService(app);
  const TEST_USER_1 = 'test_id_1';
  const TEST_USER_2 = 'test_id_2';
  const now = new Date();
  const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  const mock = [
    {
      model: TABLE_USERS,
      name: 'user1',
      data: [
        {
          id: TEST_USER_1
        }
      ]
    },
    {
      model: TABLE_USERS,
      name: 'user2',
      data: [
        {
          id: TEST_USER_2
        }
      ]
    },
    {
      model: TABLE_RIDES,
      name: 'rides',
      data: [
        {
          userId: TEST_USER_2,
          fromLocation: FROM_MOSCOW,
          toLocation: TO_SAINT_P,
          date: toTimestamp(lastYear)
        },
        {
          userId: TEST_USER_2,
          fromLocation: FROM_MOSCOW,
          toLocation: TO_SAINT_P,
          date: twoYearsAgo
        },
        {
          userId: TEST_USER_2,
          fromLocation: FROM_MOSCOW,
          toLocation: TO_SAINT_P,
          date: toTimestamp(now)
        }
      ]
    }
  ];
  mockData = await service.mockDbData(mock);
  user1Token = (await service.mockJwtTokens(TEST_USER_1)).token;
  user2Token = (await service.mockJwtTokens(TEST_USER_2)).token;
});

afterAll(async () => {
  await app.close();
});

describe('POST /rides', () => {
  test('should successfully create ride', async () => {
    const res = await app.inject({
      url: '/rides',
      method: 'POST',
      body: {
        fromLocation: 'test',
        toLocation: 'test-2',
        fromAddress: 'address',
        toAddress: 'address',
        fromRegion: 'region',
        toRegion: 'region',
        count: 3,
        price: 5000,
        date: '2024-11-21T01:19:51.841Z',
        options: ['child_seat', 'smoke', 'two_seats', 'pet', 'luggage'],
        payment: ['cash', 'card'],
        comment: 'hello how are u'
      },
      cookies: {
        token: user1Token
      }
    });

    expect(res.json()).toEqual({ status: 'OK' });
    expect(res.statusCode).toEqual(201);
  });

  test('should throw validation error', async () => {
    const res = await app.inject({
      url: '/rides',
      method: 'POST',
      body: {
        fromLocation: 'test',
        toLocation: 'test-2',
        fromAddress: 'address',
        toAddress: 'address',
        fromRegion: 'region',
        toRegion: 'region',
        count: 3,
        price: 5000,
        date: '2024-11-21T01:19:51.841Z',
        options: ['error'],
        payment: ['cash', 'card'],
        comment: 'hello how are u'
      },
      cookies: {
        token: user1Token
      }
    });

    expect(res.statusCode).toEqual(400);
    expect(res.json().message).toEqual(expect.stringMatching(`^${MESSAGE_INVALID_ENUM}`));
    expect(res.json().code).toEqual(CODE_VALIDATION_ERROR);
  });
});

describe('GET /rides list', () => {
  test('should find rides list from Moscow to Saint-petersburg', async () => {
    const {
      rides,
      user2: { name, lastName }
    } = mockData;
    const res = await app.inject({
      url: '/rides',
      method: 'GET',
      cookies: {
        token: user1Token
      },
      query: {
        from: FROM_MOSCOW,
        to: TO_SAINT_P
      }
    });

    const json = res.json();
    const [resRide] = json.data;
    const [ride] = rides;

    expect(res.statusCode).toEqual(200);
    expect(json.data.length).toEqual(rides.length);
    expect(json.total).toEqual(rides.length);
    expect(resRide.fromLocation).toEqual(FROM_MOSCOW);
    expect(resRide.toLocation).toEqual(TO_SAINT_P);
    expect(getKeys(resRide)).toEqual(getKeys({ ...ride, name, lastName }));
  });

  test('should find rides and sort by date asc', async () => {
    const res = await app.inject({
      url: '/rides',
      method: 'GET',
      cookies: {
        token: user1Token
      },
      query: {
        sort: 'date:desc'
      }
    });

    const data = res.json().data;
    const firstRes = data[0];
    const secondData = data[1];

    expect(res.statusCode).toEqual(200);
    expect(firstRes.date > secondData.date).toEqual(true);
  });
});
