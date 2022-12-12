const {
  MESSAGE_ALREADY_EXISTS,
  MESSAGE_INVALID_EMAIL,
  MESSAGE_INVALID_PASSWORD,
  MESSAGE_INCORRECT_PASSWORD,
  MESSAGE_USER_NOT_FOUND,
  MESSAGE_REFRESH_TOKEN_EXPIRED,
  CODE_INVALID_PASSWORD,
  CODE_INVALID_EMAIL,
  TABLE_USERS,
  TABLE_AUTH_TOKENS
} = require('../../lib/constants');
const { hash } = require('../../lib/hash');
const { MockService } = require('../../lib/test-env');

const app = globalThis.app;

const getValue = str => {
  const [_, value] = str.split('=');
  return value.replace('; Path', '');
};
const regJwtToken = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/;
const regUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const TEST_USER = 'TEST_USER_ID';
const TEST_USER_REFRESH_EXPIRED = 'TEST_USER_REFRESH_EXPIRED_ID';
const TEST_PASSWORD = '123123Qq';
const TEST_REFRESH = 'TEST_REFRESH_TOKEN';
let mockData = {};

beforeAll(async () => {
  const service = new MockService(app);
  const password = await hash(TEST_PASSWORD);
  const expiredAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const mock = [
    {
      model: TABLE_USERS,
      name: 'users',
      data: [
        {
          id: TEST_USER,
          password
        }
      ]
    },
    {
      model: TABLE_USERS,
      name: 'userExpiredToken',
      data: [
        {
          id: TEST_USER_REFRESH_EXPIRED
        }
      ]
    },
    {
      model: TABLE_AUTH_TOKENS,
      name: 'authTokens',
      data: [
        {
          refreshToken: TEST_REFRESH,
          userId: TEST_USER
        }
      ]
    },
    {
      model: TABLE_AUTH_TOKENS,
      name: 'expiredRefreshToken',
      data: [
        {
          userId: TEST_USER_REFRESH_EXPIRED,
          expiredAt
        }
      ]
    }
  ];
  mockData = await service.mockDbData(mock);
});

describe('/sign-up:', () => {
  test('should successfully sign up', async () => {
    const res = await app.inject({
      url: '/sign-up',
      method: 'POST',
      body: {
        password: '123123Qq!',
        email: 'test-1@email.com',
        name: 'D',
        lastName: 'B',
        phoneNumber: '+11111111111',
        privacyPolicyAccepted: true,
        termsOfUseAccepted: true
      }
    });

    const cookies = res.headers['set-cookie'];
    const [token, refreshToken] = cookies;

    expect(res.json()).toEqual({ status: 'OK' });
    expect(getValue(token)).toEqual(expect.stringMatching(regJwtToken));
    expect(getValue(refreshToken)).toEqual(expect.stringMatching(regUuid));
  });

  test(`should throw error "${MESSAGE_ALREADY_EXISTS}"`, async () => {
    const [{ email }] = mockData.users;
    const res = await app.inject({
      url: '/sign-up',
      method: 'POST',
      body: {
        password: '123123Qq!',
        email,
        name: 'D',
        lastName: 'B',
        phoneNumber: '+11111111111',
        privacyPolicyAccepted: true,
        termsOfUseAccepted: true
      }
    });

    expect(res.json().message).toEqual(MESSAGE_ALREADY_EXISTS);
    expect(res.json().statusCode).toEqual(403);
  });

  test(`should throw error "${MESSAGE_INVALID_EMAIL}"`, async () => {
    const res = await app.inject({
      url: '/sign-up',
      method: 'POST',
      body: {
        password: '123123Qq!',
        email: '@email.com',
        name: 'D',
        lastName: 'B',
        phoneNumber: '+11111111111',
        privacyPolicyAccepted: true,
        termsOfUseAccepted: true
      }
    });

    expect(res.json().message).toEqual(MESSAGE_INVALID_EMAIL);
    expect(res.json().statusCode).toEqual(400);
    expect(res.json().code).toEqual(CODE_INVALID_EMAIL);
  });

  test(`should throw error "${MESSAGE_INVALID_PASSWORD}"`, async () => {
    const res = await app.inject({
      url: '/sign-up',
      method: 'POST',
      body: {
        password: '123123',
        email: 'test-2@email.com',
        name: 'D',
        lastName: 'B',
        phoneNumber: '+11111111111',
        privacyPolicyAccepted: true,
        termsOfUseAccepted: true
      }
    });

    expect(res.json().message).toEqual(MESSAGE_INVALID_PASSWORD);
    expect(res.json().statusCode).toEqual(400);
    expect(res.json().code).toEqual(CODE_INVALID_PASSWORD);
  });
});

describe('/sign-in:', () => {
  test('should successfully sign in', async () => {
    const [{ email }] = mockData.users;
    const res = await app.inject({
      url: '/sign-in',
      method: 'POST',
      body: {
        password: TEST_PASSWORD,
        email
      }
    });

    const cookies = res.headers['set-cookie'];
    const [token, refreshToken] = cookies;

    expect(res.json()).toEqual({ status: 'OK' });
    expect(getValue(token)).toEqual(expect.stringMatching(regJwtToken));
    expect(getValue(refreshToken)).toEqual(expect.stringMatching(regUuid));
  });

  test(`should throw error "${MESSAGE_INCORRECT_PASSWORD}"`, async () => {
    const [{ email }] = mockData.users;
    const res = await app.inject({
      url: '/sign-in',
      method: 'POST',
      body: {
        password: '123Incorrect',
        email
      }
    });

    expect(res.json().message).toEqual(MESSAGE_INCORRECT_PASSWORD);
    expect(res.json().statusCode).toEqual(403);
  });

  test(`should throw error "${MESSAGE_USER_NOT_FOUND}"`, async () => {
    const res = await app.inject({
      url: '/sign-in',
      method: 'POST',
      body: {
        password: '123123Qq!',
        email: 'not-exists@email.com'
      }
    });

    expect(res.json().message).toEqual(MESSAGE_USER_NOT_FOUND);
    expect(res.json().statusCode).toEqual(404);
  });
});

describe('/refresh:', () => {
  test('should successfully refresh token', async () => {
    const [{ refreshToken: testRefreshToken }] = mockData.authTokens;
    const resRefresh = await app.inject({
      url: '/refresh',
      method: 'POST',
      body: {
        refreshToken: testRefreshToken
      }
    });

    const refreshCookies = resRefresh.headers['set-cookie'];
    const [token, refreshToken] = refreshCookies;

    expect(resRefresh.json()).toEqual({ status: 'OK' });
    expect(getValue(token)).toEqual(expect.stringMatching(regJwtToken));
    expect(getValue(refreshToken)).toEqual(expect.stringMatching(regUuid));
  });

  test(`should throw error "${MESSAGE_REFRESH_TOKEN_EXPIRED}"`, async () => {
    const [{ refreshToken }] = mockData.expiredRefreshToken;
    const res = await app.inject({
      url: '/refresh',
      method: 'POST',
      body: {
        refreshToken
      }
    });

    expect(res.json().message).toEqual(MESSAGE_REFRESH_TOKEN_EXPIRED);
    expect(res.json().statusCode).toEqual(403);
  });

  test(`should throw error "${MESSAGE_USER_NOT_FOUND}"`, async () => {
    const res = await app.inject({
      url: '/refresh',
      method: 'POST',
      body: {
        refreshToken: '1'
      }
    });

    expect(res.json().message).toEqual(MESSAGE_USER_NOT_FOUND);
    expect(res.json().statusCode).toEqual(404);
  });
});
