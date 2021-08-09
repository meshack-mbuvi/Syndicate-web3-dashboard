import { FEES_AND_DISTRIBUTION_TYPES } from "src/redux/actions/types";

const {
  EXPECTED_ANNUAL_OPERATING_FEES,
  PROFIT_SHARE_TO_SYNDICATE_LEAD,
  SYNDICATE_PROFIT_SHARE_PERCENT,
} = FEES_AND_DISTRIBUTION_TYPES;

export const setExpectedAnnualOperatingFees = (percentage: number) => (
  dispatch: (arg0: {
    type: string;
    data: number;
  }) => React.Dispatch<{ type: string; data: number }>,
): React.Dispatch<{ type: string; data: number }> => {
  return dispatch({
    type: EXPECTED_ANNUAL_OPERATING_FEES,
    data: percentage,
  });
};

export const setProfitShareToSyndicateLead = (percentage: number) => (
  dispatch: (arg0: {
    type: string;
    data: number;
  }) => React.Dispatch<{ type: string; data: number }>,
): React.Dispatch<{ type: string; data: number }> => {
  return dispatch({
    type: PROFIT_SHARE_TO_SYNDICATE_LEAD,
    data: percentage,
  });
};

export const setProfitShareToSyndProtocol = (percentage: number) => (
  dispatch: (arg0: {
    type: string;
    data: number;
  }) => React.Dispatch<{ type: string; data: number }>,
): React.Dispatch<{ type: string; data: number }> => {
  return dispatch({
    type: SYNDICATE_PROFIT_SHARE_PERCENT,
    data: percentage,
  });
};
