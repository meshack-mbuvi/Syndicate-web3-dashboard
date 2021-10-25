import ERC20ABI from "@/utils/abi/erc20";
const Web3 = require("web3");

// Approve sending the daiBalance from the user to the manager. Note that the
// approval goes to the contract, since that is what executes the transferFrom
// call.
// See https://forum.openzeppelin.com/t/uniswap-transferfrom-error-dai-insufficient-allowance/4996/4
// and https://forum.openzeppelin.com/t/example-on-how-to-use-erc20-token-in-another-contract/1682
// This prevents the error "Dai/insufficient-allowance"
// should not be used once we have the manager screen fully implemented.

/** Method to check the allowance amount set on an account
 * @param currentERC20Contract the contract of the deposit/distribution token
 * @param account the account whose allowance we need to check
 * @param syndicateContractAddress the address of the syndicate contract
 * @returns the allowance amount(wei) as a string
 */
type StringOrStringArr = string | string[];
export const checkAccountAllowance = async (
  ERC20ContractAddress: string,
  account: StringOrStringArr,
  syndicateContractAddress: StringOrStringArr,
) => {
  // set up token contract
  const web3 = new Web3(process.env.NEXT_PUBLIC_ALCHEMY);
  const tokenContract = new web3.eth.Contract(ERC20ABI, ERC20ContractAddress);
  try {
    const accountAllowance = await tokenContract.methods
      .allowance(account, syndicateContractAddress)
      .call({ from: account });
    return accountAllowance;
  } catch (allowanceError) {
    return 0;
  }
};
