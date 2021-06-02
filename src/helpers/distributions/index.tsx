/** This method gets a Syndicate's total distributions for a given ERC20
 * @param syndicateContractInstance The instance of deployed syndicate
 * @param syndicateAddress The address of the Syndicate
 * @param distributionERC20Address The address of the ERC20
 * to return total distributions
 * @return totalDistributions A BN. The caller needs to convert this to Javascript values
 * */
export const getTotalDistributions = async (
  syndicateContractInstance,
  syndicateAddress,
  distributionERC20Address: string | string[]
) => {
  if (!syndicateContractInstance) return;

  try {
    const totalDistributions = await syndicateContractInstance.methods
      .getDistributionTotal(syndicateAddress, distributionERC20Address)
      .call();

    return totalDistributions.toString();
  } catch (error) {
    console.log({ error });
    return 0;
  }
};

/** Method to get an LP's claimed distributions for a given ERC20
 * @param syndicateAddress The address of the Syndicate
 * @param lpAddress The address of the LP whose info is being queried
 * @param distributionERC20ContractAddress The address of the ERC20
 * to return the LP's claimed distributions
 * @return claimedDistributions by an LP for a given
 * distributionERC20ContractAddress
 * */
export const getClaimedDistributions = async (
  syndicateInstance: any,
  address: string | string[],
  lpAddress: string,
  ERC20ContractAddress: string = ""
) => {
  try {
    const claimedDistributions = await syndicateInstance.getClaimedDistributions(
      address,
      lpAddress,
      ERC20ContractAddress,
      { gasLimit: 800000 }
    );
    return claimedDistributions.toString();
  } catch (error) {
    console.log({ error });
    return 0;
  }
};
