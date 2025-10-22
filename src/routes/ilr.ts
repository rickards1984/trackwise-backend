import { Router } from 'express';
import { createILR } from '../modules/ilr/generator.js';

export const ilrRouter = Router();

ilrRouter.get('/export/:year', async (req, res) => {
  const year = req.params.year; // e.g. "2526"
  const xml = createILR({
    collectionYear: year,
    ukprn: process.env.SEED_TENANT_UKPRN || '12345678',
    learners: [{
      learnRefNumber: 'L000001',
      familyName: 'Rickards',
      givenNames: 'Michael',
      dateOfBirth: '1984-01-01',
      postcode: 'ZZ99 9ZZ'
    }]
  });
  res.set('Content-Type', 'application/xml').send(xml);
});