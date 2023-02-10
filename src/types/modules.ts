import { RequirementType } from '@/hooks/data-fetching/thegraph/generated-types';
import { TokenGateOption } from '@/state/createInvestmentClub/types';
import { TokenDetails } from './token';

export enum ModuleType {
  MINT = 'mint',
  OWNER = 'owner'
}

export interface Requirement {
  id: string;
  contractAddress: string;
  requirementType?: RequirementType;
  maxMemberCount?: string;
  maxTotalSupply?: string;
  maxPerMember?: string;
  startTime?: string;
  endTime?: string;
  requiredTokensLogicalOperator?: boolean | null;
  requiredTokens?: string[] | null;
  requiredTokenBalances?: string[] | null;
}

export interface Module {
  contractAddress: string;
}
export interface ActiveRequirement {
  requirement: Requirement;
}

export interface ActiveModule extends Module {
  id: string;
  contractAddress: string;
  activeRequirements: ActiveRequirement[];
}

export interface IRequiredTokenRules {
  contractAddress: string;
  quantity: string;
}

export interface ModuleReqs {
  maxMemberCount?: string | null;
  maxTotalSupply?: string | null;
  maxPerMember?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  requiredTokensLogicalOperator?: boolean | null;
  requiredTokens?: string[] | null;
  requiredTokenBalances?: string[] | null;
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
  requirementMet: boolean;
  requiredBalance: string;
}
export interface TokenGatedRequirementsDetails {
  meetsRequirements: boolean;
  requiredTokenDetails?: TokenReqDetails[];
}
