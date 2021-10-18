import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { DocumentType, EntityType, IActionPayload } from "./types";

export const setStandaloneFields =
  createAction<IActionPayload>("spv/standaloneLLC");
export const setSeriesFields = createAction<IActionPayload>("spv/seriesLLC");
export const setOperatingAgreementFields = createAction<IActionPayload>(
  "spv/operatingAgreement",
);
export const setExistingEntityFields = createAction<IActionPayload>(
  "spv/existingEntity",
);
export const setExistingEntityTaskFields = createAction<IActionPayload>(
  "spv/existingEntity/Tasks",
);
export const setDocumentType = createAction<DocumentType>(
  "spv/setDocumentType",
);
export const setLegalInfo = createAction<DocumentType>("spv/setLegalInfo");

export const fetchLegalInfo = createAsyncThunk(
  "spv/fetchLegalInfoStatus",
  async (syndicateAddress: string, { rejectWithValue }) => {
    try {
      const res = await fetch("SYNDICATE_LEGAL_INFO_QUERY");
      const json = await res.json();
      if (json.errors) {
        // Errors from web2 backend
        return rejectWithValue(json.errors);
      }
      return json.data.Legal_syndicateLegalInfo;
    } catch (error) {
      // Network Error
      return rejectWithValue(error.response.data);
    }
  },
);

// TODO: DELETE below actions author@victor.mutai
interface ISetTaskProgress {
  progress: number;
  taskIdx: number;
  milestoneIdx: number;
}
export const setEntityName = createAction<string>("spv/setEntityName");
export const setEntityType = createAction<EntityType>("spv/setEntityType");
export const setTaskProgress = createAction<ISetTaskProgress>(
  "spv/setTaskProgress",
);
// END of to be deleted
