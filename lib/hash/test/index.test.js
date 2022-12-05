const { hash, verify } = require('../index');

const regHashedPassword = /^[0-9a-fA-F]{16,}:[0-9a-fA-F]{64,}$/;

test('should successfully hash password', async () => {
  const password = '123123Qq';
  const hashedPassword = await hash(password);

  expect(hashedPassword).toEqual(expect.stringMatching(regHashedPassword));
});

test('should successfully verify password: true', async () => {
  const password = '123123Qq';
  const hashedPassword = await hash(password);
  const res = await verify(password, hashedPassword);

  expect(res).toEqual(true);
});

test('should successfully verify password: false', async () => {
  const password = '123123Qq';
  const hashedPassword = await hash(password);
  const res = await verify('incorrect', hashedPassword);

  expect(res).toEqual(false);
});
