import { createSlice } from '@reduxjs/toolkit';

export interface ModalsState {
  isChangeSyndicateSettinsModalOpen: boolean;
}

const initialState: ModalsState = {
  isChangeSyndicateSettinsModalOpen: false
};

export const Modals = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openChangeSyndicateSettingsModal: (state) => {
      state.isChangeSyndicateSettinsModalOpen = true;
    },
    closeModals: (state) => {
      state.isChangeSyndicateSettinsModalOpen = false;
    }
  }
});

// Action creators are generated for each case reducer function
export const { openChangeSyndicateSettingsModal, closeModals } = Modals.actions;

export default Modals.reducer;
