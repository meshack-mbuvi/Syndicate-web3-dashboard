// Approve sending the daiBalance from the user to the manager. Note that the
// approval goes to the contract, since that is what executes the transferFrom
// call.
// See https://forum.openzeppelin.com/t/uniswap-transferfrom-error-dai-insufficient-allowance/4996/4
// and https://forum.openzeppelin.com/t/example-on-how-to-use-erc20-token-in-another-contract/1682
// This prevents the error "Dai/insufficient-allowance"

import { toEther } from "@/utils/conversions";

// Setting an amount specifies the approval level
export const approveManager = async (
  daiContract,
  account,
  managerAddress,
  amount
) => {
  const amountDai = toEther(amount).toString();

  try {
    await daiContract.methods
      .approve(managerAddress, amountDai)
      .send({ from: account, gasLimit: 800000 });

    // Check the approval amount
    const daiAllowance = await daiContract.methods
      .allowance(account.toString(), managerAddress)
      .call({ from: account });

    return parseInt(daiAllowance);
  } catch (approveError) {
    console.log({ approveError });
    return 0;
  }
};
