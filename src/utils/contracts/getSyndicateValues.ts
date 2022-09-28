import { GuardMixinManager } from '@/ClubERC20Factory/GuardMixinManager';
import { ModuleReqs } from '@/types/modules';

export const getSyndicateValues = async (
  address: string,
  policyMintERC20: any,
  mintPolicy: any,
  guardMixinManager: GuardMixinManager,
  activeMintReqs: ModuleReqs,
  mintModule: string
): Promise<any> => {
  let currentMintPolicyAddress = '';
  let endTime,
    maxMemberCount,
    maxTotalSupply,
    requiredToken,
    requiredTokenMinBalance,
    startTime;
  if (mintModule && activeMintReqs) {
    currentMintPolicyAddress = guardMixinManager.address || '';
    startTime = activeMintReqs.startTime;
    endTime = activeMintReqs.endTime;
    maxMemberCount = activeMintReqs.maxMemberCount;
    maxTotalSupply = activeMintReqs.maxTotalSupply;
  } else {
    if (policyMintERC20) {
      currentMintPolicyAddress = policyMintERC20?.address || '';
      ({
        endTime,
        maxMemberCount,
        maxTotalSupply,
        requiredToken,
        requiredTokenMinBalance,
        startTime
      } = await policyMintERC20?.getSyndicateValues(address));
    }

    if (
      !+endTime &&
      !+maxMemberCount &&
      !+maxTotalSupply &&
      !+startTime &&
      mintPolicy
    ) {
      ({
        endTime,
        maxMemberCount,
        maxTotalSupply,
        requiredToken,
        requiredTokenMinBalance,
        startTime
      } = await mintPolicy?.getSyndicateValues(address));

      // Change current mint policy
      currentMintPolicyAddress = mintPolicy?.address;
    }
  }

  return {
    endTime,
    maxMemberCount,
    maxTotalSupply,
    requiredToken,
    requiredTokenMinBalance,
    startTime,
    currentMintPolicyAddress
  };
};
