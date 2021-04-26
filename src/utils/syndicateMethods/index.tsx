import { etherToNumber } from "../conversions";

/** This method gets a Syndicate's total distributions for a given ERC20
 * @param address The address of the Syndicate
 * @param distributionERC20ContractAddress The address of the ERC20
 * to return total distributions
 * @param syndicateInstance Instance of the syndicate
 * @return totalDistributions as a string
 * */
export const getTotalDistributions = async (
  address: string | string[],
  distributionERC20ContractAddress: string | string[],
  syndicateInstance
) => {
  const syndicateAddress = address;
  try {
    /** call method from contract to get a Syndicate's total distributions for a given ERC20
     * @param syndicateAddress The address of the Syndicate
     * @param distributionERC20ContractAddress The address of the ERC20
     * to return total distributions
     * @return totalDistributions for a given distributionERC20ContractAddress
     * */
    const totalDistributions = await syndicateInstance.getTotalDistributions(
      syndicateAddress,
      distributionERC20ContractAddress
    );

    return etherToNumber(totalDistributions.toString());
  } catch (error) {
    console.log({ error });
  }
};
