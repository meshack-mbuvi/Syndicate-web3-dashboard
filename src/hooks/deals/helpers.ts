import {
  Deal,
  DealPreview,
  DealStatus,
  MixinModuleRequirementType
} from './types';

const getStatus = (executed: boolean, endTime: string): DealStatus => {
  if (executed) {
    return DealStatus.EXECUTED;
  }
  if (parseInt((new Date().getTime() / 1000).toString()) > +endTime) {
    return DealStatus.CLOSED;
  }
  return DealStatus.OPEN;
};

export const processDealsToDealPreviews = (deals: Deal[]): DealPreview[] => {
  return deals.map((deal: Deal): DealPreview => {
    const timeMixin = deal.mixins.find(
      (mixin) => mixin.requirementType == MixinModuleRequirementType.TIME_WINDOW
    );
    return {
      dealName: deal.dealToken.name,
      contractAddress: deal.dealToken.id,
      status: getStatus(deal.closed, timeMixin?.endTime || '0'),
      goal: deal.goal,
      depositToken: deal.depositToken,
      depositTokenSymbol: 'USDC',
      totalCommitments: deal.numCommits,
      totalCommitted: deal.totalCommitted,
      dealSymbol: deal.dealToken.symbol,
      isOwner: false,
      goalCompletionPercentage: Math.round(+deal.totalCommitted / +deal.goal)
    };
  });
};
