import { TokenGateOption } from '@/state/createInvestmentClub/types';
import { TokenDetails } from './token';

export enum ModuleType {
  MINT = 'mint',
  OWNER = 'owner'
}

export enum RequirementType {
  MAX_MEMBER = 'MAX_MEMBER_COUNT',
  MAX_PER_MEMBER = 'MAX_PER_MEMBER',
  MAX_SUPPLY = 'MAX_TOTAL_SUPPLY',
  TIME_WINDOW = 'TIME_WINDOW',
  TOKEN_GATED = 'TOKEN_GATED'
}

export interface Requirement {
  contractAddress: string;
  requirementType: RequirementType;
  maxMemberCount?: string;
  maxTotalSupply?: string;
  maxPerMember?: string;
  startTime?: string;
  endTime?: string;
  requiredTokensLogicalOperator?: boolean;
  requiredTokens?: string[];
  requiredTokenBalances?: string[];
}

export interface ActiveRequirement {
  id: string;
  requirement: Requirement;
}

export interface ActiveModule {
  contractAddress: string;
  activeRequirements: ActiveRequirement[];
}

export interface IRequiredTokenRules {
  contractAddress: string;
  quantity: string;
}

export interface ModuleReqs {
  maxMemberCount?: string;
  maxTotalSupply?: string;
  maxPerMember?: string;
  startTime?: string;
  endTime?: string;
  requiredTokensLogicalOperator?: boolean;
  requiredTokens?: string[];
  requiredTokenBalances?: string[];
  requiredTokenRules?: IRequiredTokenRules[];
  requiredTokenGateOption?: TokenGateOption;
  isTokenGated?: boolean;
  mixins?: string[];
}

export interface ActiveModuleDetails {
  hasActiveModules: boolean;
  activeModules: ActiveModule[];
  mintModule: string; //TODO: [TOKEN-GATING / REFACTOR] confirm with DepositDetails.mintModule
  activeMintModuleReqs: ModuleReqs;
  ownerModule: string;
  activeOwnerModuleReqs: ModuleReqs;
}

export interface TokenReqDetails extends TokenDetails {
  requirementMet: false;
  requiredBalance: string;
}
export interface TokenGatedRequirementsDetails {
  meetsRequirements: boolean;
  requiredTokenDetails?: TokenReqDetails[];
}
