import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
  IClubInfo,
  IMemberInfo,
  IWalletSignature,
  IDepositReadyInfo,
} from "./types";

export interface IState {
  memberInfo: IMemberInfo;
  clubInfo: IClubInfo;
  walletSignature: IWalletSignature;
  depositReadyInfo: IDepositReadyInfo;
}

const initialState: IState = {
  memberInfo: {
    memberName: "",
    depositAmount: "",
    emailAddress: "",
  },
  clubInfo: {
    legalEntityName: "",
    isSeriesLLC: false,
    masterLLC: "",
    seriesLLC: "",
    adminName: "",
    hasCounsel: false,
    counselName: "",
    counselEmail: "",
    location: "",
    managerEmail: "",
    generalPurposeStatement: "",
    dueDate: "",
    adminSignDate: "",
    adminSignature: "SIGN HERE",
    percentLoss: 20,
    blockNumber: "ten",
    daysNotice: 3,
    adminRemovalThreshold: "Majority in interest",
    taxPercentage: 10,
  },
  walletSignature: {
    signature: "",
    timeSigned: new Date(),
  },
  depositReadyInfo: {
    depositLink: "",
    adminSigned: false,
  },
};

const clubInfoModifier = (clubInfo: IState["clubInfo"]) => {
  clubInfo.hasCounsel = clubInfo.hasCounsel || !!clubInfo.counselName;
  if (!clubInfo.isSeriesLLC || clubInfo.seriesLLC) return clubInfo;

  clubInfo.seriesLLC = clubInfo.legalEntityName;
  const { seriesLLC, masterLLC } = clubInfo;
  clubInfo.legalEntityName = `${seriesLLC}, a series of ${masterLLC}`;
  return clubInfo;
};

export const LegalInfo = createSlice({
  name: "legalInfo",
  initialState,
  reducers: {
    setMemberLegalInfo(state, action: PayloadAction<IMemberInfo>) {
      state.memberInfo = action.payload;
    },
    setClubLegalInfo(state, action) {
      const newClubInfo = clubInfoModifier(action.payload);
      for (const [key, value] of Object.entries(newClubInfo)) {
        state.clubInfo[key] = value;
      }
    },
    setWalletSignature(state, action: PayloadAction<IWalletSignature>) {
      state.walletSignature = action.payload;
    },
    setDepositReadyInfo(state, action: PayloadAction<IDepositReadyInfo>) {
      state.depositReadyInfo = action.payload;
    },
  },
});

export const {
  setMemberLegalInfo,
  setClubLegalInfo,
  setWalletSignature,
  setDepositReadyInfo,
} = LegalInfo.actions;

export default LegalInfo.reducer;
