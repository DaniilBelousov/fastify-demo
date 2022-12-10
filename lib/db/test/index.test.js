'use strict';

const CommonModel = require('../models/common');
const { Users, AuthTokens } = require('../models');
const {
  TABLE_USERS,
  CODE_VALIDATION_ERROR,
  CODE_SYSTEM_ERROR
} = require('../../constants');
const { getConfig } = require('../../config');

const regUuid =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
const TEST_TABLE = 'Test';

describe('Common model', () => {
  test('should successfully create model', () => {
    const model = new CommonModel({}, TEST_TABLE);
    expect(model).toBeDefined();
    expect(model.table).toEqual(TEST_TABLE);
  });

  test('should successfully create test data', async () => {
    const queryBuilder = { insert: jest.fn().mockReturnThis() };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);
    const testData = { data: 'test' };

    const id = await model.create(testData);

    expect(id).toEqual(expect.stringMatching(regUuid));
    expect(knex).toBeCalledWith(TEST_TABLE);
    expect(queryBuilder.insert).toBeCalledWith({
      ...testData,
      id: expect.stringMatching(regUuid)
    });
    expect(queryBuilder.insert).toBeCalledTimes(1);
  });

  test('should  successfully find one row', async () => {
    const testId = 'id';
    const testData = { id: testId, data: 'test' };
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnValue(testData)
    };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);

    const res = await model.findOne(testId);

    expect(res).toEqual(testData);
    expect(knex).toBeCalledWith(TEST_TABLE);
    expect(queryBuilder.where).toBeCalledWith({
      id: testId
    });
    expect(queryBuilder.where).toBeCalledTimes(1);
    expect(queryBuilder.first).toBeCalledTimes(1);
  });

  test('should successfully find many rows without pagination', async () => {
    const testRes = { data: 'test' };
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      toSQL: jest.fn().mockReturnThis(),
      toNative: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnValue(testRes)
    };
    const userId = 'id';
    const select = '*';
    const testData = { where: { userId }, select, orderBy: ['date', 'asc'], first: true };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);

    const res = await model.findMany(testData);

    expect(res).toEqual(testRes);
    expect(knex).toBeCalledWith(TEST_TABLE);
    expect(queryBuilder.where).toBeCalledWith({
      userId
    });
    expect(queryBuilder.where).toBeCalledTimes(1);
    expect(queryBuilder.select).toBeCalledWith(select);
    expect(queryBuilder.select).toBeCalledTimes(1);
    expect(queryBuilder.orderBy).toBeCalledWith('date', 'asc');
    expect(queryBuilder.orderBy).toBeCalledTimes(1);
    expect(queryBuilder.first).toBeCalledTimes(1);
    expect(queryBuilder.toSQL).toBeCalledTimes(1);
    expect(queryBuilder.toNative).toBeCalledTimes(1);
  });

  test('should successfully find many rows with pagination', async () => {
    const testRes = [{ data: 'test' }];
    const testTotal = [{ total: 1 }];
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnValueOnce(testRes).mockReturnThis(),
      toSQL: jest.fn().mockReturnThis(),
      toNative: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      count: jest.fn().mockReturnThis().mockReturnValueOnce(testTotal)
    };
    const userId = 'id';
    const select = '*';
    const testData = { where: { userId }, select };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);
    const { limit: defaultLimit, page: defaultPage } = getConfig('pagination');
    const offset = (defaultPage - 1) * defaultLimit;

    const res = await model.findMany(testData, { pagination: true });

    expect(res.data).toEqual(testRes);
    expect(res.total).toEqual(1);
    expect(res.limit).toEqual(defaultLimit);
    expect(res.page).toEqual(1);
    expect(knex).toBeCalledWith(TEST_TABLE);
    expect(queryBuilder.where).toBeCalledWith({
      userId
    });
    expect(queryBuilder.select).toBeCalledWith(select);
    expect(queryBuilder.select).toBeCalledWith('');
    expect(queryBuilder.limit).toBeCalledWith(defaultLimit);
    expect(queryBuilder.offset).toBeCalledWith(offset);
    expect(queryBuilder.count).toBeCalledWith('* as total');
  });

  test('should successfully find many rows with custom pagination', async () => {
    const testRes = [{ data: 'test' }];
    const testTotal = [{ total: 100 }];
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnValueOnce(testRes).mockReturnThis(),
      toSQL: jest.fn().mockReturnThis(),
      toNative: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      count: jest.fn().mockReturnThis().mockReturnValueOnce(testTotal)
    };
    const userId = 'id';
    const select = '*';
    const testData = { where: { userId }, select };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);
    const limit = 20;
    const page = 2;
    const offset = (page - 1) * limit;

    const res = await model.findMany(testData, { pagination: { limit, page } });

    expect(res.data).toEqual(testRes);
    expect(res.total).toEqual(100);
    expect(res.limit).toEqual(limit);
    expect(res.page).toEqual(page);
    expect(knex).toBeCalledWith(TEST_TABLE);
    expect(queryBuilder.where).toBeCalledWith({
      userId
    });
    expect(queryBuilder.select).toBeCalledWith(select);
    expect(queryBuilder.select).toBeCalledWith('');
    expect(queryBuilder.limit).toBeCalledWith(limit);
    expect(queryBuilder.offset).toBeCalledWith(offset);
    expect(queryBuilder.count).toBeCalledWith('* as total');
  });

  test('should return undefined on find first', async () => {
    const email = 'test@test.com';
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      first: jest.fn().mockReturnValue(undefined),
      toSQL: jest.fn().mockReturnThis(),
      toNative: jest.fn().mockReturnThis()
    };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);

    const res = await model.findMany({ where: { email }, first: true });

    expect(res).toEqual(undefined);
    expect(queryBuilder.where).toBeCalledWith({ email });
    expect(queryBuilder.first).toBeCalledTimes(1);
  });

  test('should successfully remove row', async () => {
    const id = 'test_id';
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis()
    };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);

    await model.remove(id);

    expect(queryBuilder.where).toBeCalledWith({ id });
    expect(queryBuilder.where).toBeCalledTimes(1);
    expect(queryBuilder.del).toBeCalledTimes(1);
  });

  test('should successfully run knex query', async () => {
    const queryBuilder = {
      select: jest.fn().mockReturnThis()
    };
    const knex = jest.fn().mockReturnValue(queryBuilder);
    const model = new CommonModel(knex, TEST_TABLE);
    const reqAll = '*';

    await model.knexQuery().select(reqAll);

    expect(knex).toBeCalledTimes(1);
    expect(queryBuilder.select).toBeCalledWith(reqAll);
    expect(queryBuilder.select).toBeCalledTimes(1);
  });

  test('should throw error if knex not setup', () => {
    try {
      new Users(undefined, TABLE_USERS, 'users');
    } catch ({ code }) {
      expect(code).toEqual(CODE_SYSTEM_ERROR);
    }
  });

  test('should throw error if table not setup', () => {
    try {
      new CommonModel({}, '');
    } catch ({ code }) {
      expect(code).toEqual(CODE_SYSTEM_ERROR);
    }
  });
});

describe('Users model', () => {
  const user = {
    password:
      'fb3726c054e641633023fefffd075b6d:a86eaeef91bf222eaa2ab782bdcba4424a3ca140ae987f7373dab8ec635300f458ca860ecd49e7fbe994444625533f026a070f1332063e58cfa40f419a375099',
    email: 'test-1@email.com',
    name: 'D',
    lastName: 'B',
    phoneNumber: '+11111111111',
    privacyPolicyAccepted: true,
    termsOfUseAccepted: true
  };
  const queryBuilder = {
    insert: jest.fn().mockReturnValue()
  };
  const knex = jest.fn().mockReturnValue(queryBuilder);
  const UsersModel = new Users(knex);

  test('should successfully create user', async () => {
    const res = await UsersModel.create(user);

    expect(res).toEqual(expect.stringMatching(regUuid));
    expect(queryBuilder.insert).toBeCalledWith({
      ...user,
      id: expect.stringMatching(regUuid)
    });
  });

  test('should throw validation error', async () => {
    const invalidUser = { ...user, email: 'invalid' };
    const { message, code } = await UsersModel.create(invalidUser).catch(err => err);
    expect(message).toEqual(expect.stringMatching(/^email must match pattern/));
    expect(code).toEqual(CODE_VALIDATION_ERROR);
  });
});

describe('AuthTokens model', () => {
  const authToken = {
    userId: 'user_id',
    expiredAt: new Date().toISOString().slice(0, 19).replace('T', '')
  };
  const queryBuilder = {
    insert: jest.fn().mockReturnValue(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockReturnValue(authToken),
    del: jest.fn().mockReturnThis()
  };
  const knex = jest.fn().mockReturnValue(queryBuilder);
  const AuthTokensModel = new AuthTokens(knex);

  test('should successfully create auth token', async () => {
    const res = await AuthTokensModel.create(authToken);

    expect(res).toEqual(expect.stringMatching(regUuid));
    expect(queryBuilder.insert).toBeCalledWith({
      ...authToken,
      refreshToken: expect.stringMatching(regUuid)
    });
  });

  test('should successfully find one', async () => {
    const refreshToken = 'refresh';

    const res = await AuthTokensModel.findOne(refreshToken);

    expect(res).toEqual(authToken);
    expect(queryBuilder.where).toBeCalledWith({ refreshToken });
    expect(queryBuilder.first).toBeCalledTimes(1);
  });

  test('should successfully remove auth token', async () => {
    const refreshToken = 'refresh';

    await AuthTokensModel.remove(refreshToken);

    expect(queryBuilder.where).toBeCalledWith({ refreshToken });
    expect(queryBuilder.del).toBeCalledTimes(1);
  });
});
