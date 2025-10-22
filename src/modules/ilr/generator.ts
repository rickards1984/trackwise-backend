import { create } from 'xmlbuilder2';

export interface ILRLearner {
  learnRefNumber: string;
  familyName: string;
  givenNames: string;
  dateOfBirth: string;
  postcode: string;
}

export interface ILROptions {
  collectionYear: string;
  ukprn: string;
  learners: ILRLearner[];
}

export function createILR(options: ILROptions): string {
  const { collectionYear, ukprn, learners } = options;
  
  // Create the root Message element
  const root = create({
    version: '1.0',
    encoding: 'UTF-8'
  }).ele('Message', {
    'xmlns': 'ESFA/ILR/2025-26',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xsi:schemaLocation': 'ESFA/ILR/2025-26'
  });

  // Header section
  const header = root.ele('Header');
  const collectionDetails = header.ele('CollectionDetails');
  collectionDetails.ele('Collection').txt('ILR');
  collectionDetails.ele('Year').txt(`20${collectionYear.substring(0, 2)}`);
  collectionDetails.ele('FilePreparationDate').txt(new Date().toISOString().split('T')[0]);

  // Source section
  const source = root.ele('Source');
  source.ele('ProtectiveMarking').txt('OFFICIAL-SENSITIVE');
  source.ele('UKPRN').txt(ukprn);
  source.ele('SoftwareName').txt('Trackwise');
  source.ele('SoftwareVersion').txt('1.0.0');
  source.ele('DateTime').txt(new Date().toISOString());

  // Learning Provider section
  const learningProvider = root.ele('LearningProvider');
  learningProvider.ele('UKPRN').txt(ukprn);

  // Learners section
  learners.forEach(learner => {
    const learnerElement = learningProvider.ele('Learner');
    learnerElement.ele('LearnRefNumber').txt(learner.learnRefNumber);
    learnerElement.ele('FamilyName').txt(learner.familyName);
    learnerElement.ele('GivenNames').txt(learner.givenNames);
    learnerElement.ele('DateOfBirth').txt(learner.dateOfBirth);
    learnerElement.ele('Postcode').txt(learner.postcode);
    
    // Basic learner destination and progression - skeleton structure
    const learnerDestinationandProgression = learnerElement.ele('LearnerDestinationandProgression');
    learnerDestinationandProgression.ele('ULN').txt('1000000001'); // Placeholder ULN
    
    // Learning delivery - skeleton structure for ILR compliance
    const learningDelivery = learnerElement.ele('LearningDelivery');
    learningDelivery.ele('LearnAimRef').txt('50086832'); // Placeholder learning aim reference
    learningDelivery.ele('AimType').txt('1'); // Programme aim
    learningDelivery.ele('AimSeqNumber').txt('1');
    learningDelivery.ele('LearnStartDate').txt('2025-09-01');
    learningDelivery.ele('LearnPlanEndDate').txt('2027-08-31');
    learningDelivery.ele('FundModel').txt('36'); // Apprenticeship funding model
    learningDelivery.ele('ProgType').txt('25'); // Advanced apprenticeship
    learningDelivery.ele('FworkCode').txt('593'); // Placeholder framework code
    learningDelivery.ele('PwayCode').txt('1'); // Pathway code
    learningDelivery.ele('CompStatus').txt('1'); // Continuing
  });

  // Return the XML as string
  return root.end({ prettyPrint: true });
}