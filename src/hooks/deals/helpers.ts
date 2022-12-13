import { Deal, DealPreview, PrecommitsDeal } from './types';

export const processDealsToDealPreviews = (deals: Deal[]): DealPreview[] => {
  //TODO [WINGZ]: should totalCommitted be converted?
  return deals.map((deal: Deal): DealPreview => {
    return {
      dealName: deal.dealToken.name,
      status: deal.closed ? 'CLOSED' : 'OPEN',
      goal: deal.goal,
      depositToken: deal.depositToken,
      totalCommitments: deal.numCommits,
      totalCommited: deal.totalCommitted
    };
  });
};

export const processPrecommitDealsToDealPreviews = (
  precommits: PrecommitsDeal[]
): DealPreview[] => {
  return precommits.reduce(
    (filtered: DealPreview[], precommit: PrecommitsDeal) => {
      if (precommit.status !== 'CANCELED') {
        filtered.push({
          dealName: precommit.deal.dealToken.name,
          status: precommit.deal.closed ? 'CLOSED' : 'OPEN',
          goal: precommit.deal.goal,
          depositToken: precommit.deal.depositToken,
          totalCommitments: precommit.deal.numCommits,
          totalCommited: precommit.deal.totalCommitted
        });
      }
      return filtered;
    },
    []
  );
};
