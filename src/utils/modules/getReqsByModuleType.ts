import {
  ActiveModule,
  ModuleReqs,
  ModuleType,
  RequirementType
} from '@/types/modules';
import { IActiveNetwork } from '@/state/wallet/types';
import getModuleByType from './getModuleByType';
import { TokenGateOption } from '@/state/createInvestmentClub/types';

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
    // @ts-expect-error TS(2322): Type 'ActiveModule | null' is not assignable to type 'ActiveModule | undefined'.
    activeModule = getModuleByType(type, modules, activeNetwork);
  }

  if (!activeModule) {
    return null;
  }

  const moduleReqs: ModuleReqs = {
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | undefined'.
    maxMemberCount: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | undefined'.
    maxTotalSupply: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | undefined'.
    maxPerMember: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | undefined'.
    startTime: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | undefined'.
    endTime: null,
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'string | undefined'.
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
        moduleReqs.requiredTokenRules = req?.requiredTokens?.map(
          (contractAddress, index) => ({
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
