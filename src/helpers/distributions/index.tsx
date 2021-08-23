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
  ERC20ContractAddress: string = "",
) => {
  try {
    const claimedDistributions = await syndicateInstance.getClaimedDistributions(
      address,
      lpAddress,
      ERC20ContractAddress
    );
    return claimedDistributions.toString();
  } catch (error) {
    console.log({ error });
    return 0;
  }
};
