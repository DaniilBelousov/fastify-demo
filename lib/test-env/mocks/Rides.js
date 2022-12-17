'use strict';

const getDate = () => {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = [
  {
    id: 'e1a859a8-7d93-11ed-a1eb-0242ac120002',
    fromLocation: 'A',
    toLocation: 'B',
    fromAddress: 'address',
    toAddress: 'address-to',
    fromRegion: 'from-region',
    toRegion: 'to-region',
    count: 3,
    price: 1000,
    comment: 'random comment',
    options: '["smoke"]',
    payment: '["cache"]',
    date: getDate()
  },
  {
    id: 'e1a859a8-7d93-11ed-a1eb-0242ac120123',
    fromLocation: 'C',
    toLocation: 'E',
    fromAddress: 'address-123',
    toAddress: 'address-123',
    fromRegion: 'from-region-123',
    toRegion: 'to-region-123',
    count: 3,
    price: 1000,
    comment: 'random comment 123',
    options: '["smoke"]',
    payment: '["cache"]',
    date: getDate()
  },
  {
    id: 'e1a859a8-7d93-11ed-a1eb-0242aqweq',
    fromLocation: 'A',
    toLocation: 'B',
    fromAddress: 'address-qwe',
    toAddress: 'address-to-qwe',
    fromRegion: 'from-region-qwe',
    toRegion: 'to-region-qwe',
    count: 3,
    price: 1000,
    comment: 'random comment qwe',
    options: '["smoke"]',
    payment: '["cache"]',
    date: getDate()
  }
];
