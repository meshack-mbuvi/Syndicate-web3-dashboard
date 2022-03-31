import { operatingAgreementSeries } from './operatingAgreementSeries';
import { operatingAgreementStandalone } from './operatingAgreementStandalone';
import { subscriptionAgreement } from './subscriptionAgreement';

import template from 'lodash/template';
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
