import { useMutation, useQuery, gql } from "@apollo/client";

import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

import {
  DocumentType,
  ILegalTabMilestone,
  LegalTask,
  initialState,
} from "./types";

const [CREATE_SIGNATURE_REQUEST, IS_LLC_NAME_AVAILABLE, SYNDICATE_LEGAL_INFO] =
  [gql``, gql``, gql``];

export const useCreateSignatureRequest: any = (documentType: DocumentType) => {
  const { SPVReducer } = useSelector((state: RootState) => state);

  const state = {
    [DocumentType.SERIES_LLC]: {
      store: SPVReducer.seriesLLC,
      fields: Object.keys(initialState.seriesLLC),
    },
    [DocumentType.STANDALONE_LLC]: {
      store: SPVReducer.standaloneLLC,
      fields: Object.keys(initialState.standaloneLLC),
    },
    [DocumentType.OPERATING_AGREEMENT]: {
      store: SPVReducer.operatingAgreement,
      fields: Object.keys(initialState.operatingAgreement),
    },
    [DocumentType.FORM_ID]: {
      store: SPVReducer.formId,
      fields: Object.keys(initialState.formId),
    },
    [DocumentType.FORM_D]: {
      store: SPVReducer.formD,
      fields: Object.keys(initialState.formD),
    },
  };

  const payload = state[documentType].fields.map((field: string) => {
    return {
      name: field,
      value: state[documentType].store[field],
    };
  });

  return useMutation(CREATE_SIGNATURE_REQUEST, {
    variables: {
      legalCreateDocumentType: documentType,
      legalCreateDocumentFields: payload,
      legalCreateDocumentSyndicate: "0x101",
    },
  });
};

export const useQueryIsLLCNameAvailable: any = (llcName: string) => {
  return useQuery(IS_LLC_NAME_AVAILABLE, {
    variables: {
      legalIsLlcNameAvailableName: llcName,
    },
  });
};

export const useLegatTabState = (
  milestoneIdx: number,
  taskIdx = 0,
): {
  milestone: ILegalTabMilestone;
  task: LegalTask;
} => {
  const { milestones } = useSelector(
    (state: RootState) => state.SPVReducer.syndicateLegal,
  );
  const milestone: ILegalTabMilestone = milestones[milestoneIdx];
  const task: LegalTask = milestone.tasks[taskIdx];

  return {
    milestone,
    task, // NB: don't use task if you didn't provide taskIdx as an argument
  };
};

export const useQuerySyndicateLegalInfo: any = (syndicateAddress: string) => {
  return useQuery(SYNDICATE_LEGAL_INFO, {
    variables: {
      legalSyndicateLegalInfoSyndicateAddress: syndicateAddress,
    },
  });
};
