import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./types";

const setCollectibleDetailsSlice = createSlice({
  name: "collectibles",
  initialState,
  reducers: {
    setShowFullScreen(state, action: PayloadAction<boolean>) {
      state.showFullScreen = action.payload;
    },
    setOverlayCollectibleDetails(state, action: PayloadAction<any>) {
      state.overlayCollectibleDetails = action.payload;
    },
    setShowCollectibleModal(state, action: PayloadAction<boolean>) {
      state.showCollectibleModal = action.payload;
    },
    setCollectibleModalDetails(state, action: PayloadAction<any>) {
      state.collectibleModalDetails = action.payload;
    },
  },
});

export const {
  setOverlayCollectibleDetails,
  setShowFullScreen,
  setShowCollectibleModal,
  setCollectibleModalDetails,
} = setCollectibleDetailsSlice.actions;

export default setCollectibleDetailsSlice.reducer;
