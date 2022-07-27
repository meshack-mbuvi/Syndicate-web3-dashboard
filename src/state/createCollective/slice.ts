import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './types';

const getEpochCloseTime = (closeDate: Date, closeTime: string) => {
  let newDate = new Date(
    closeDate.setHours(
      Number(closeTime.split(':')[0]),
      Number(closeTime.split(':')[1])
    )
  );
  return ~~(newDate.getTime() / 1000);
};

const createCollectiveSlice = createSlice({
  name: 'createCollectiveClub',
  initialState,
  reducers: {
    setCollectiveName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setCollectiveSymbol(state, action: PayloadAction<string>) {
      state.symbol = `${action.payload}`;
    },
    setCollectiveArtwork(state, action: PayloadAction<any>) {
      state.artwork = action.payload.artwork;
      state.artworkType = action.payload.artworkType;
      state.artworkUrl = action.payload.artworkUrl;
    },
    setCollectiveDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setCollectivePricePerNFT(state, action: PayloadAction<number>) {
      state.pricePerNFT = action.payload;
    },
    setCollectiveMaxPerWallet(state, action: PayloadAction<number>) {
      state.maxPerWallet = action.payload;
    },
    setCollectiveMembershipType(state, action) {
      state.membershipType = action.payload;
    },
    setCollectiveOpenUntil(state, action) {
      state.openUntil = action.payload;
    },
    setCollectiveCloseDate(state, action: PayloadAction<Date>) {
      state.closeDate = action.payload;

      let epochTime = getEpochCloseTime(action.payload, state.closeTime);
      state.EpochCloseTime = epochTime;
    },
    setCollectiveCloseTime(state, action: PayloadAction<string>) {
      state.closeTime = action.payload;

      let epochTime = getEpochCloseTime(state.closeDate, action.payload);
      state.EpochCloseTime = epochTime;
    },
    setCollectiveTimeWindow(state, action) {
      state.timeWindow = action.payload;
    },
    setCollectiveCloseAfterMaxSupply(state, action: PayloadAction<boolean>) {
      state.closeAfterMaxSupply = action.payload;
    },
    setCollectiveMaxSupply(state, action: PayloadAction<number>) {
      state.maxSupply = action.payload;
    },
    setCollectiveTransferrable(state, action: PayloadAction<boolean>) {
      state.transferrable = action.payload;
    },
    setColectiveTokenDetails(state, action: PayloadAction<any>) {
      state.tokenDetails = action.payload;
    },

    // Creation status
    setCollectiveCreationStatus(state, action: PayloadAction<any>) {
      state.creationStatus = action.payload;
    },
    setCollectiveSubmittingToIPFS(state, action: PayloadAction<boolean>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        submittingToIPFS: action.payload
      };
    },
    setIpfsError(state, action: PayloadAction<boolean>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        ipfsError: action.payload
      };
    },
    setCollectiveWaitingForConfirmation(state, action: PayloadAction<boolean>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        waitingForConfirmation: action.payload
      };
    },
    setCollectiveConfirmed(state, action: PayloadAction<boolean>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        confirmed: action.payload
      };
    },
    setCollectiveTransactionSuccess(state, action: PayloadAction<boolean>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        transactionSuccess: action.payload
      };
    },
    setCollectiveTransactionError(state, action: PayloadAction<boolean>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        transactionError: action.payload
      };
    },
    setCollectiveTransactionHash(state, action: PayloadAction<string>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        confirmed: true,
        transactionHash: action.payload
      };
    },
    setIpfsHash(state, action: PayloadAction<string>) {
      state.creationStatus = {
        ...initialState.creationStatus,
        submittingToIPFS: true,
        ipfsHash: action.payload
      };
    },

    // reset
    resetCollectiveCreationState(state) {
      state = initialState;
    }
  }
});

export const {
  setCollectiveName,
  setCollectiveSymbol,
  setCollectiveArtwork,
  setCollectiveDescription,
  setCollectivePricePerNFT,
  setCollectiveMaxPerWallet,
  setCollectiveMembershipType,
  setCollectiveOpenUntil,
  setCollectiveTimeWindow,
  setCollectiveCloseDate,
  setCollectiveCloseTime,
  setCollectiveCloseAfterMaxSupply,
  setCollectiveMaxSupply,
  setCollectiveTransferrable,
  setColectiveTokenDetails,
  setCollectiveCreationStatus,
  setCollectiveSubmittingToIPFS,
  setIpfsError,
  setCollectiveWaitingForConfirmation,
  setCollectiveConfirmed,
  setCollectiveTransactionSuccess,
  setCollectiveTransactionError,
  setCollectiveTransactionHash,
  setIpfsHash,
  resetCollectiveCreationState
} = createCollectiveSlice.actions;
export default createCollectiveSlice.reducer;
