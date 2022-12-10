const clearTestData = async app => {
  const {
    models: { Users, AuthTokens, Rides }
  } = app;
  await AuthTokens.knexQuery().del();
  await Rides.knexQuery().del();
  await Users.knexQuery().del();
};

module.exports = { clearTestData };
