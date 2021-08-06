import { SYNDICATE_OFF_CHAIN_TYPES } from "@/redux/actions/types";
import { initialState } from "../../initialState";

const {
  SYNDICATE_NAME,
  COUNTRY,
  ORGANIZATION,
  EMAIL,
  SYNDICATE_TYPE,
} = SYNDICATE_OFF_CHAIN_TYPES;

type STATE = typeof initialState;

export const syndicateOffChainDataReducer = (
  state = initialState,
  action: { type: string; data: string },
): STATE => {
  const { createSyndicate } = state;
  switch (action.type) {
    case SYNDICATE_TYPE:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          syndicateOffChainData: {
            ...createSyndicate.syndicateOffChainData,
            type: action.data,
          },
        },
      };

    case SYNDICATE_NAME:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          syndicateOffChainData: {
            ...createSyndicate.syndicateOffChainData,
            syndicateName: action.data,
          },
        },
      };

    case EMAIL:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          syndicateOffChainData: {
            ...createSyndicate.syndicateOffChainData,
            email: action.data,
          },
        },
      };

    case COUNTRY:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          syndicateOffChainData: {
            ...createSyndicate.syndicateOffChainData,
            country: action.data,
          },
        },
      };

    case ORGANIZATION:
      return {
        ...state,
        createSyndicate: {
          ...createSyndicate,
          syndicateOffChainData: {
            ...createSyndicate.syndicateOffChainData,
            organization: action.data,
          },
        },
      };

    default:
      return state;
  }
};