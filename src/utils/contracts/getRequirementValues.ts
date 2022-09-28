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
    // @ts-expect-error TS(2322): Type 'null' is not assignable to type 'boolean | undefined'.
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
