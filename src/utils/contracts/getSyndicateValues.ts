export const getSyndicateValues = async (
  address: string,
  policyMintERC20,
  mintPolicy
): Promise<any> => {
  let currentMintPolicyAddress = policyMintERC20.address;

  let {
    endTime,
    maxMemberCount,
    maxTotalSupply,
    requiredToken,
    requiredTokenMinBalance,
    startTime
  } = await policyMintERC20?.getSyndicateValues(address);

  if (!+endTime && !+maxMemberCount && !+maxTotalSupply && !+startTime) {
    ({
      endTime,
      maxMemberCount,
      maxTotalSupply,
      requiredToken,
      requiredTokenMinBalance,
      startTime
    } = await mintPolicy?.getSyndicateValues(address));

    // Change current mint policy
    currentMintPolicyAddress = mintPolicy.address;
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
