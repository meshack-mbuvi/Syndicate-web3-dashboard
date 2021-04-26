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
  const amountDai = toEther(amount).toString();
  try {
    await currentERC20Contract.methods
      .approve(managerAddress, amountDai)
      .send({ from: account, gasLimit: 800000 });

    // Check the approval amount
    /** @returns wei allowance as a string */
    const daiAllowance = await currentERC20Contract.methods
      .allowance(account.toString(), managerAddress)
      .call({ from: account });

    return parseInt(daiAllowance);
  } catch (approveError) {
    console.log({ approveError });
    return 0;
  }
};

// use this function in case syndicate has allowlistEnabled set to true.
// get current manager to allow addresses
// should not be used once we have the manager screen fully implemented.
export const managerAllowAddresses = async (
  syndicateInstance,
  managerAccount,
  lpAddresses: string[]
) => {
  try {
    await syndicateInstance.allowAddresses(managerAccount, lpAddresses, {
      from: managerAccount,
    });
  } catch (err) {
    console.log({ "Allow address error": err });
  }
};

// get current manager to set distribution
// use this function to test withdrawals on Rinkeby testnet for now
// should not be used once we have the manager screen fully implemented.
export const managerSetDistribution = async (
  syndicate,
  syndicateInstance,
  syndicateAddress,
  managerAccount,
  amount,
  currentERC20Contract,
  account
) => {
  // close the syndicate first if it is open.
  if (syndicate.syndicateOpen) {
    try {
      await syndicateInstance.closeSyndicate(syndicateAddress, {
        from: managerAccount,
      });
    } catch (err) {
      console.log("Cannot close syndicate", err);
    }
  }

  // set allowances
  try {
    approveManager(
      currentERC20Contract,
      account,
      syndicateInstance.address,
      amount
    );
  } catch (error) {
    console.log({ error });
  }

  // set distribution
  try {
    const amountDai = toEther(amount).toString();
    const receipt = await syndicateInstance.setDistribution(
      syndicateAddress,
      syndicate.depositERC20ContractAddress,
      amountDai,
      {
        from: managerAccount,
      }
    );
  } catch (err) {
    console.log("Set Distribution error", err);
  }
};
