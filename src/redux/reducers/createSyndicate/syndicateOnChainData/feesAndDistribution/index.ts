import { FEES_AND_DISTRIBUTION_TYPES } from "@/redux/actions/types";
import { initialState } from "../../../initialState";

type STATE = typeof initialState;

const {
  EXPECTED_ANNUAL_OPERATING_FEES,
  PROFIT_SHARE_TO_SYNDICATE_LEAD,
  SYNDICATE_PROFIT_SHARE_PERCENT,
} = FEES_AND_DISTRIBUTION_TYPES;

export const feesAndDistributionReducer = (
  state = initialState,
  action: { type: string; data: number },
): STATE => {
  const { createSyndicate } = state;
  switch (action.type) {
    case EXPECTED_ANNUAL_OPERATING_FEES:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          feesAndDistribution: {
            ...createSyndicate.feesAndDistribution,
            expectedAnnualOperatingFees: action.data,
          },
        },
      };

    case PROFIT_SHARE_TO_SYNDICATE_LEAD:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          feesAndDistribution: {
            ...createSyndicate.feesAndDistribution,
            profitShareToSyndicateLead: action.data,
          },
        },
      };

    case SYNDICATE_PROFIT_SHARE_PERCENT:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          feesAndDistribution: {
            ...createSyndicate.feesAndDistribution,
            syndicateProfitSharePercent: action.data,
          },
        },
      };

    default:
      return state;
  }
};
