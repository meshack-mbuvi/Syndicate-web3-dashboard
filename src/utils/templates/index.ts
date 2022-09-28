import { operatingAgreementSeries } from './operatingAgreementSeries';
import { operatingAgreementStandalone } from './operatingAgreementStandalone';
import { subscriptionAgreement } from './subscriptionAgreement';

import template from 'lodash/template';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'loda... Remove this comment to see the full error message
import templateSettings from 'lodash/templateSettings';

templateSettings.interpolate = /\[\[([\s\S]+?)\]\]/g;

export const getTemplates = (isSeriesLLC: boolean) => {
  const opAgreement = isSeriesLLC
    ? operatingAgreementSeries
    : operatingAgreementStandalone;

  return {
    compiledOp: template(opAgreement),
    compiledSub: template(subscriptionAgreement)
  };
};
