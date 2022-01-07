export interface IMemberInfo {
  emailAddress: string;
  memberName: string;
  depositAmount: string;
}

export interface IClubInfo {
  legalEntityName: string;
  isSeriesLLC: boolean;
  masterLLC: string;
  seriesLLC: string;
  adminName: string;
  hasCounsel: boolean;
  counselName: string;
  counselEmail: string;
  location: string;
  managerEmail: string;
  generalPurposeStatement: string;
  percentLoss: number;
  dueDate: string;
  adminSignDate: string;
  adminSignature: string;

  // Defaults
  blockNumber: string;
  daysNotice: number;
  adminRemovalThreshold: string;
  taxPercentage: number;
}

export interface IWalletSignature {
  signature: string;
  timeSigned: Date;
}
