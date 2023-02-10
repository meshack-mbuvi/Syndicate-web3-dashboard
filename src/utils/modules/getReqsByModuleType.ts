import { RequirementType } from '@/hooks/data-fetching/thegraph/generated-types';
import { TokenGateOption } from '@/state/createInvestmentClub/types';
import { IActiveNetwork } from '@/state/wallet/types';
import { ActiveModule, ModuleReqs, ModuleType } from '@/types/modules';
import getModuleByType from './getModuleByType';

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
  module: ActiveModule | null
): ModuleReqs | null => {
  let activeModule: ActiveModule | null = module;
  if (!activeModule && modules) {
    activeModule = getModuleByType(type, modules, activeNetwork);
  }

  if (!activeModule) {
    return null;
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
  const mixins: string[] = [];
  for (let i = 0; i < activeModuleReqs.length; i++) {
    const req = activeModuleReqs[i].requirement;
    mixins.push(req.contractAddress);
    switch (req.requirementType) {
      case RequirementType.MaxMemberCount:
        moduleReqs.maxMemberCount = req.maxMemberCount;
        break;
      case RequirementType.MaxTotalSupply:
        moduleReqs.maxTotalSupply = req.maxTotalSupply;
        break;
      case RequirementType.MaxPerMember:
        moduleReqs.maxPerMember = req.maxPerMember;
        break;
      case RequirementType.TimeWindow:
        moduleReqs.startTime = req.startTime;
        moduleReqs.endTime = req.endTime;
        break;
      case RequirementType.TokenGated:
        moduleReqs.requiredTokensLogicalOperator =
          req.requiredTokensLogicalOperator;
        moduleReqs.requiredTokens = req.requiredTokens;
        moduleReqs.requiredTokenBalances = req.requiredTokenBalances;
        moduleReqs.requiredTokenRules = req?.requiredTokens?.map(
          (contractAddress: string, index: number) => ({
            contractAddress,
            quantity: req.requiredTokenBalances
              ? req.requiredTokenBalances[index]
              : ''
          })
        );
        moduleReqs.isTokenGated = true;
        if (req?.requiredTokens?.length) {
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
