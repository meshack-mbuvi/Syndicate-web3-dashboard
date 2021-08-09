import { SYNDICATE_OFF_CHAIN_TYPES } from "src/redux/actions/types";

const {
  SYNDICATE_NAME,
  COUNTRY,
  ORGANIZATION,
  EMAIL,
  SYNDICATE_TYPE,
} = SYNDICATE_OFF_CHAIN_TYPES;

export const setSyndicateName = (syndicateName: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> => {
  return dispatch({
    type: SYNDICATE_NAME,
    data: syndicateName.trim(),
  });
};

export const setCountry = (country: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> => {
  return dispatch({
    type: COUNTRY,
    data: country,
  });
};

export const setOrganization = (organization: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> => {
  return dispatch({
    type: ORGANIZATION,
    data: organization,
  });
};

export const setEmail = (email: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> => {
  return dispatch({
    type: EMAIL,
    data: email,
  });
};

export const setSyndicateType = (syndicateType: string) => (
  dispatch: (arg0: {
    type: string;
    data: string;
  }) => React.Dispatch<{ type: string; data: string }>,
): React.Dispatch<{ type: string; data: string }> => {
  return dispatch({
    type: SYNDICATE_TYPE,
    data: syndicateType,
  });
};
