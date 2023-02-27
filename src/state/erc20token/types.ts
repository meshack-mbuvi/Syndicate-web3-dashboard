import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import {
  ERC20TokenDefaultState,
  initialActiveModuleDetailsState
} from '@/helpers/erc20TokenDetails';
import {
  ActiveModuleDetails,
  TokenGatedRequirementsDetails
} from '@/types/modules';
// import { LogicalOperator } from '../createInvestmentClub/types';

export interface ERC20Token {
  isValid?: boolean;
  name: string;
  owner: string;
  address: string;
  currentMintPolicyAddress?: string;
  totalSupply?: string;
  tokenDecimals: number;
  totalDeposits?: string;
  depositsEnabled: boolean;
  claimEnabled: boolean;
  symbol: string;
  startTime: number;
  endTime: number;
  memberCount: number;
  maxTotalDeposits: number;
  loading: boolean;
  maxMemberCount: number;
  maxTotalSupply: string;
  requiredToken: string;
  requiredTokenMinBalance: string;
  depositToken?: string;
  mintModule?: string;
}

export interface DepositDetails {
  mintModule: string;
  nativeDepositToken: boolean;
  depositToken: string;
  depositTokenSymbol: string;
  depositTokenLogo: string;
  depositTokenName: string;
  depositTokenDecimals: number;
  loading: boolean;
}

export enum IActiveModuleRequirementType {
  MAX_MEMBER_COUNT = 'MAX_MEMBER_COUNT',
  MAX_TOTAL_SUPPLY = 'MAX_TOTAL_SUPPLY',
  TIME_WINDOW = 'TIME_WINDOW',
  TOKEN_GATED = 'TOKEN_GATED'
}

// export interface IActiveModuleResponse {
//   isActive: boolean;
//   contractAddress: string;
//   activeRequirements: {
//     requirement: {
//       contractAddress: string;
//       requirementType: IActiveModuleRequirementType;
//       maxMemberCount: string | null;
//       maxTotalSupply: string | null;
//       startTime: string | null;
//       endTime: string | null;
//       requiredTokensLogicalOperator: boolean | null;
//       requiredTokens: string[] | null;
//       requiredTokenBalances: string[] | null;
//     };
//   }[];
// }

// export type IActiveModule = Record<
//   IActiveModuleRequirementType,
//   {
//     contractAddress: string;
//     requirementType: IActiveModuleRequirementType;
//     maxMemberCount: number | null;
//     maxTotalSupply: string | null;
//     startTime: number | null;
//     endTime: number | null;
//     logicalOperator: LogicalOperator | null;
//     tokensWithBalance:
//       | {
//           quantity: number;
//           contractAddress: string;
//         }[]
//       | null;
//   }
// >;

export const initialState: {
  erc20Token: ERC20Token;
  depositDetails: DepositDetails;
  erc20TokenContract: ClubERC20Contract | null;
  activeModuleDetails: ActiveModuleDetails;
  tokenGatingDetails: TokenGatedRequirementsDetails;
  depositTokenPriceInUSD?: number;
  isNewClub: boolean;
  loadingClubDeposits: boolean;
} = {
  erc20Token: ERC20TokenDefaultState,
  depositDetails: {
    mintModule: '',
    nativeDepositToken: false,
    depositToken: '',
    depositTokenSymbol: '',
    // default to USDC token to avoid error being thrown while loading the token
    depositTokenLogo: '/images/usdcIcon.svg',
    depositTokenName: '',
    depositTokenDecimals: 6,
    loading: true
  },
  erc20TokenContract: null,
  activeModuleDetails: initialActiveModuleDetailsState,
  tokenGatingDetails: {
    meetsRequirements: false,
    requiredTokenDetails: []
  },
  depositTokenPriceInUSD: 0,
  isNewClub: false,
  loadingClubDeposits: false
};
