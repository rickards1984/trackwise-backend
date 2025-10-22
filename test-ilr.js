import { createILR } from './dist/server/src/modules/ilr/generator.js';

// Test the ILR generator
const xml = createILR({
  collectionYear: '2526',
  ukprn: '12345678',
  learners: [{
    learnRefNumber: 'L000001',
    familyName: 'Rickards',
    givenNames: 'Michael',
    dateOfBirth: '1984-01-01',
    postcode: 'ZZ99 9ZZ'
  }]
});

console.log(xml);