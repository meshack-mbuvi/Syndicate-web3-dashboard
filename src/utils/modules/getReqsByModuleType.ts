import {
  ActiveModule,
  ModuleReqs,
  ModuleType,
  RequirementType
} from '@/types/modules';
import { IActiveNetwork } from '@/state/wallet/types';
import getModuleByType from './getModuleByType';
import { TokenGateOption } from '@/state/createInvestmentClub/types';
import { isZeroAddress } from '../isZeroAddress';

/**
 * Temporary placeholder for getting active module reqs by module type
 * @param type
 * @param modules
 * @param activeNetwork
 * @param module
 * @returns
 */
const getReqsByModuleByType = (
  type: ModuleType,
  modules: ActiveModule[],
  activeNetwork: IActiveNetwork,
  module?: ActiveModule
): ModuleReqs | null => {
  let activeModule = module;
  if (!activeModule) {
    activeModule = getModuleByType(type, modules, activeNetwork);
  }

  if (!activeModule) {
    return;
  }

  const moduleReqs: ModuleReqs = {
    maxMemberCount: null,
    maxTotalSupply: null,
    maxPerMember: null,
    startTime: null,
    endTime: null,
    requiredTokensLogicalOperator: null,
    requiredTokens: [],
    requiredTokenBalances: [],
    requiredTokenRules: [],
    requiredTokenGateOption: TokenGateOption.UNRESTRICTED
  };
  const activeModuleReqs = activeModule.activeRequirements;
  const mixins = [];
  for (let i = 0; i < activeModuleReqs.length; i++) {
    const req = activeModuleReqs[i].requirement;
    mixins.push(req.contractAddress);
    switch (req.requirementType) {
      case RequirementType.MAX_MEMBER:
        moduleReqs.maxMemberCount = req.maxMemberCount;
        break;
      case RequirementType.MAX_SUPPLY:
        moduleReqs.maxTotalSupply = req.maxTotalSupply;
        break;
      case RequirementType.MAX_PER_MEMBER:
        moduleReqs.maxPerMember = req.maxPerMember;
        break;
      case RequirementType.TIME_WINDOW:
        moduleReqs.startTime = req.startTime;
        moduleReqs.endTime = req.endTime;
        break;
      case RequirementType.TOKEN_GATED:
        moduleReqs.requiredTokensLogicalOperator =
          req.requiredTokensLogicalOperator;
        moduleReqs.requiredTokens = req.requiredTokens;
        moduleReqs.requiredTokenBalances = req.requiredTokenBalances;
        moduleReqs.requiredTokenRules = req.requiredTokens.map(
          (contractAddress, index) => ({
            contractAddress,
            quantity: req.requiredTokenBalances[index]
          })
        );
        moduleReqs.isTokenGated = true;
        if (req.requiredTokens.length) {
          moduleReqs.requiredTokenGateOption = TokenGateOption.RESTRICTED;
        } else {
          moduleReqs.requiredTokenGateOption = TokenGateOption.UNRESTRICTED;
        }
        break;
    }
  }
  moduleReqs.mixins = mixins;
  return moduleReqs;
};

export default getReqsByModuleByType;
