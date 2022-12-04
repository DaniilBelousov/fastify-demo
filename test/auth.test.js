const {
  MESSAGE_ALREADY_EXISTS,
  MESSAGE_INVALID_EMAIL,
  MESSAGE_INVALID_PASSWORD,
  MESSAGE_INCORRECT_PASSWORD,
  MESSAGE_USER_NOT_FOUND,
  MESSAGE_REFRESH_TOKEN_EXPIRED,
  CODE_INVALID_PASSWORD,
  CODE_INVALID_EMAIL
} = require('../lib/constants');

const app = globalThis.app;

const getValue = str => {
  const [_, value] = str.split('=');
  return value.replace('; Path', '');
};
const regJwtToken = /^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/;
const regUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

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
  const request = {
    url: '/sign-up',
    method: 'POST',
    body: {
      password: '123123Qq!',
      email: 'test-2@email.com',
      name: 'D',
      lastName: 'B',
      phoneNumber: '+11111111111',
      privacyPolicyAccepted: true,
      termsOfUseAccepted: true
    }
  };

  const res1 = await app.inject(request);
  const res2 = await app.inject(request);

  expect(res1.json()).toEqual({ status: 'OK' });
  expect(res2.json().message).toEqual(MESSAGE_ALREADY_EXISTS);
  expect(res2.json().statusCode).toEqual(403);
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
      email: 'test-3@email.com',
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

test('should successfully sign up -> sign in', async () => {
  const resSignUp = await app.inject({
    url: '/sign-up',
    method: 'POST',
    body: {
      password: '123123Qq!',
      email: 'test-3@email.com',
      name: 'D',
      lastName: 'B',
      phoneNumber: '+11111111111',
      privacyPolicyAccepted: true,
      termsOfUseAccepted: true
    }
  });
  const resSignIn = await app.inject({
    url: '/sign-in',
    method: 'POST',
    body: {
      password: '123123Qq!',
      email: 'test-3@email.com'
    }
  });

  const cookies = resSignIn.headers['set-cookie'];
  const [token, refreshToken] = cookies;

  expect(resSignUp.json()).toEqual({ status: 'OK' });
  expect(resSignIn.json()).toEqual({ status: 'OK' });
  expect(getValue(token)).toEqual(expect.stringMatching(regJwtToken));
  expect(getValue(refreshToken)).toEqual(expect.stringMatching(regUuid));
});

test(`should throw error "${MESSAGE_INCORRECT_PASSWORD}"`, async () => {
  const resSignUp = await app.inject({
    url: '/sign-up',
    method: 'POST',
    body: {
      password: '123123Qq!',
      email: 'test-4@email.com',
      name: 'D',
      lastName: 'B',
      phoneNumber: '+11111111111',
      privacyPolicyAccepted: true,
      termsOfUseAccepted: true
    }
  });
  const resSignIn = await app.inject({
    url: '/sign-in',
    method: 'POST',
    body: {
      password: '123123Qq',
      email: 'test-4@email.com'
    }
  });

  expect(resSignIn.json().message).toEqual(MESSAGE_INCORRECT_PASSWORD);
  expect(resSignIn.json().statusCode).toEqual(403);
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

test('should successfully refresh token', async () => {
  const resSignUp = await app.inject({
    url: '/sign-up',
    method: 'POST',
    body: {
      password: '123123Qq!',
      email: 'test-5@email.com',
      name: 'D',
      lastName: 'B',
      phoneNumber: '+11111111111',
      privacyPolicyAccepted: true,
      termsOfUseAccepted: true
    }
  });

  const signUpCookies = resSignUp.headers['set-cookie'];
  const [_, signUpRefreshToken] = signUpCookies;

  const resRefresh = await app.inject({
    url: '/refresh',
    method: 'POST',
    body: {
      refreshToken: getValue(signUpRefreshToken)
    }
  });

  const refreshCookies = resRefresh.headers['set-cookie'];
  const [token, refreshToken] = refreshCookies;

  expect(resRefresh.json()).toEqual({ status: 'OK' });
  expect(getValue(token)).toEqual(expect.stringMatching(regJwtToken));
  expect(getValue(refreshToken)).toEqual(expect.stringMatching(regUuid));
});
