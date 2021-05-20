// Approve sending the daiBalance from the user to the manager. Note that the
// approval goes to the contract, since that is what executes the transferFrom
// call.
// See https://forum.openzeppelin.com/t/uniswap-transferfrom-error-dai-insufficient-allowance/4996/4
// and https://forum.openzeppelin.com/t/example-on-how-to-use-erc20-token-in-another-contract/1682
// This prevents the error "Dai/insufficient-allowance"
// should not be used once we have the manager screen fully implemented.

import { toEther } from "@/utils/conversions";

// Setting an amount specifies the approval level
export const approveManager = async (
  currentERC20Contract,
  account,
  managerAddress,
  amount
) => {
  try {
    await currentERC20Contract.methods
      .approve(managerAddress, amount)
      .send({ from: account, gasLimit: 800000 });

    // Check the approval amount
    /** @returns wei allowance as a string */
    const daiAllowance = await currentERC20Contract.methods
      .allowance(account.toString(), managerAddress)
      .call({ from: account });

    return parseInt(daiAllowance);
  } catch (approveError) {
    console.log({ approveError });
    return approveError;
  }
};

/** Method to check the allowance amount set on an account
 * @param currentERC20Contract the contract of the deposit/distribution token
 * @param account the account whose allowance we need to check
 * @param syndicateContractAddress the address of the syndicate contract
 * @returns the allowance amount(wei) as a string
 */
export const checkAccountAllowance = async (
  currentERC20Contract: any,
  account: string,
  syndicateContractAddress: string | string[]
) => {
  try {
    const accountAllowance = await currentERC20Contract.methods
      .allowance(account, syndicateContractAddress)
      .call({ from: account });
    return accountAllowance;
  } catch (allowanceError) {
    return 0;
  }
};
