'use strict';

const { randomUUID } = require('node:crypto');

module.exports = [
  {
    id: randomUUID(),
    email: '1a692ae6d4eda17095f5685434e6285e@test.test',
    password:
      'fb3726c054e641633023fefffd075b6d:a86eaeef91bf222eaa2ab782bdcba4424a3ca140ae987f7373dab8ec635300f458ca860ecd49e7fbe994444625533f026a070f1332063e58cfa40f419a375099',
    name: 'Daniel',
    lastName: 'Bel',
    phoneNumber: '+79999999999',
    privacyPolicyAccepted: true,
    termsOfUseAccepted: true
  },
  {
    id: randomUUID(),
    email: '6a60ce328334f97fefa092caf7347af0@test.test',
    password:
      'fb3726c054e641633023fefffd075b6d:a86eaeef91bf222eaa2ab782bdcba4424a3ca140ae987f7373dab8ec635300f458ca860ecd49e7fbe994444625533f026a070f1332063e58cfa40f419a375099',
    name: 'Anatoly',
    lastName: 'Her',
    phoneNumber: '+79999999999',
    privacyPolicyAccepted: false,
    termsOfUseAccepted: false
  },
  {
    id: randomUUID(),
    email: 'fdc38541712be54edae241010b3e0e27@test.test',
    password:
      'fb3726c054e641633023fefffd075b6d:a86eaeef91bf222eaa2ab782bdcba4424a3ca140ae987f7373dab8ec635300f458ca860ecd49e7fbe994444625533f026a070f1332063e58cfa40f419a375099',
    name: 'Remm',
    lastName: 'Uti',
    phoneNumber: '+79111111111',
    privacyPolicyAccepted: true,
    termsOfUseAccepted: true
  }
];
