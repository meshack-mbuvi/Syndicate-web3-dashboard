import { GuardMixinManager } from '@/ClubERC20Factory/GuardMixinManager';
import { MaxTotalSupplyMixin } from '@/ClubERC20Factory/maxTotalSupplyMixin';
import { TimeRequirements } from '@/ClubERC20Factory/TimeRequirements';
import { ModuleReqs } from '@/types/modules';

export const getModuleRequirementValues = async (
  tokenAddress: string,
  guardMixinManager: GuardMixinManager,
  moduleAddress: string,
  timeWindowMixin: TimeRequirements,
  maxTotalSupplyMixin: MaxTotalSupplyMixin
): Promise<ModuleReqs> => {
  const moduleReqAddresses = await guardMixinManager.getModuleRequirements(
    tokenAddress,
    moduleAddress
  );

  const moduleReqs: ModuleReqs = {
    maxMemberCount: null,
    maxTotalSupply: null,
    maxPerMember: null,
    startTime: null,
    endTime: null,
    requiredTokensLogicalOperator: null,
    requiredTokens: [],
    requiredTokenBalances: []
  };

  let timeWindow: { startTime: number; endTime: number };

  for (let i = 0; i < moduleReqAddresses.length; i++) {
    switch (moduleReqAddresses[i]) {
      case timeWindowMixin.address:
        timeWindow = await timeWindowMixin.getTimeRequirements(tokenAddress);
        moduleReqs.startTime = timeWindow.startTime.toString();
        moduleReqs.endTime = timeWindow.endTime.toString();
        break;
      case maxTotalSupplyMixin.address:
        moduleReqs.maxTotalSupply = await maxTotalSupplyMixin
          .getMaxTotalSupply(tokenAddress)
          .toString();
        break;
      default:
        break;
    }
  }

  return moduleReqs;
};

export default getModuleRequirementValues;
