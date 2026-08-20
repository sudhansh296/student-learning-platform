export { expressIntroLesson } from './01-introduction';
export { expressRoutingLesson } from './02-routing-basics';
export { expressMiddlewareLesson } from './03-middleware';
export { expressRequestResponseLesson } from './04-request-response';
export { expressRestApiLesson } from './05-rest-api';
export { expressErrorHandlingLesson } from './06-error-handling';
export { expressStaticFilesLesson } from './07-static-files';
export { expressTemplatingLesson } from './08-templating';
export { expressAuthenticationLesson } from './09-authentication';
export { expressValidationLesson } from './10-validation';
export { expressDatabaseLesson } from './11-database';
export { expressReferencesLesson } from './12-references';
export { expressFileUploadsLesson } from './13-file-uploads';
export { expressSecurityLesson } from './14-security';
export { expressTestingLesson } from './15-testing';

import type { ExpressLesson } from '../express-curriculum';
import { expressIntroLesson } from './01-introduction';
import { expressRoutingLesson } from './02-routing-basics';
import { expressMiddlewareLesson } from './03-middleware';
import { expressRequestResponseLesson } from './04-request-response';
import { expressRestApiLesson } from './05-rest-api';
import { expressErrorHandlingLesson } from './06-error-handling';
import { expressStaticFilesLesson } from './07-static-files';
import { expressTemplatingLesson } from './08-templating';
import { expressAuthenticationLesson } from './09-authentication';
import { expressValidationLesson } from './10-validation';
import { expressDatabaseLesson } from './11-database';
import { expressReferencesLesson } from './12-references';
import { expressFileUploadsLesson } from './13-file-uploads';
import { expressSecurityLesson } from './14-security';
import { expressTestingLesson } from './15-testing';

export const allExpressLessons: ExpressLesson[] = [
  expressIntroLesson,
  expressRoutingLesson,
  expressMiddlewareLesson,
  expressRequestResponseLesson,
  expressRestApiLesson,
  expressErrorHandlingLesson,
  expressStaticFilesLesson,
  expressTemplatingLesson,
  expressAuthenticationLesson,
  expressValidationLesson,
  expressDatabaseLesson,
  expressReferencesLesson,
  expressFileUploadsLesson,
  expressSecurityLesson,
  expressTestingLesson,
];
