app = globalThis.app;

test('should successfully sign up', async () => {
  const res = await app.inject({
    url: '/sign-up',
    method: 'POST',
    body: {
      password: '123123Qq!',
      email: 'test@email.com',
      name: 'D',
      lastName: 'B',
      phoneNumber: '+11111111111',
      privacyPolicyAccepted: true,
      termsOfUseAccepted: true
    }
  });

  expect(res.json()).toEqual({ status: 'OK' });
});
