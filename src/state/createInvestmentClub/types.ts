import { Token } from '@/types/token';

export type mintEndTime = {
  mintTime: string;
  value: number;
};

export type tokenDetails = {
  depositToken: string;
  depositTokenSymbol: string;
  depositTokenLogo: any;
  depositTokenName: string;
  depositTokenDecimals: number;
};

export enum TokenGateOption {
  RESTRICTED,
  UNRESTRICTED
}

export enum LogicalOperator {
  AND = 'AND',
  OR = 'OR'
}

export type TokenGateRule = {
  name: string;
  quantity: number;
  symbol: string;
  chainId?: number;
  contractAddress: string;
  icon?: string | null;
  decimals?: number;
};

export type ICurrentSelectedToken = {
  idx?: number;
  quantity?: number;
  token?: Token;
};

export interface InitialState {
  investmentClubName: string;
  investmentClubSymbol: string;
  investmentClubSymbolPlaceHolder: string;
  tokenCap: string;
  mintEndTime: mintEndTime;
  mintSpecificEndTime: string;
  membersCount: string;
  membershipAddresses: string[];
  clubCreationStatus: {
    transactionHash: string;
    creationReceipt:
      | {
          token: string;
        }
      | any;
  };
  tokenDetails: tokenDetails;
  errors: {
    memberAddresses: string;
    duplicateRules: number[];
    nullRules: number[];
    hasMoreThanFiveRules: boolean;
  };
  tokenGateOption: TokenGateOption;
  amountToMintPerAddress: number;
  showTokenGateModal: boolean;
  showImportTokenModal: boolean;
  currentSelectedToken: ICurrentSelectedToken;
  tokenRules: TokenGateRule[];
  logicalOperator: LogicalOperator;
}

export const initialState: InitialState = {
  investmentClubName: '',
  investmentClubSymbol: '',
  investmentClubSymbolPlaceHolder: '', // Don't send this to backend. use investmentClubSymbol above
  tokenCap: '', // How much are you raising?
  mintEndTime: {
    mintTime: '',
    value: parseInt(
      (new Date(new Date().setHours(23, 59, 0, 0)).getTime() / 1000).toString()
    )
  }, // How long will deposits be accepted?
  mintSpecificEndTime: '23:59',
  membersCount: '', // How many members can join?
  membershipAddresses: [], // Addresses of members
  clubCreationStatus: {
    transactionHash: '',
    creationReceipt: {
      tokenAddress: ''
    }
  },
  tokenDetails: {
    depositToken: '',
    depositTokenSymbol: '',
    depositTokenLogo: '',
    depositTokenName: '',
    depositTokenDecimals: 0
  },
  errors: {
    memberAddresses: '',
    duplicateRules: [],
    nullRules: [],
    hasMoreThanFiveRules: false
  },
  tokenGateOption: TokenGateOption.RESTRICTED,
  amountToMintPerAddress: 0,
  showTokenGateModal: false,
  showImportTokenModal: false,
  currentSelectedToken: {
    idx: 0,
    quantity: 1
  },
  tokenRules: [
    {
      name: '',
      quantity: 1,
      symbol: '',
      chainId: 1,
      contractAddress: '',
      icon: null,
      decimals: 18
    }
  ],
  logicalOperator: LogicalOperator.OR
};
