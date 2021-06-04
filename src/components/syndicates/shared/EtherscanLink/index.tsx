import React from "react";
import { ExternalLinkIcon } from "src/components/iconWrappers";

interface LinkProp {
  contractAddress: string | string[];
}

/** Link used to redirect the user to the Etherscan
 * This could point to either the syndicate contract
 * or the token contract when token transactions are involved.
 */
export const EtherscanLink = (props: LinkProp) => {
  const { contractAddress } = props;
  // get debug mode from the .env
  // If we're in debug mode, we'll use the rinkeby testnet.
  const debugging = process.env.NEXT_PUBLIC_DEBUG;
  let etherscanLink = "https://etherscan.io/address/";
  if (debugging == "true") {
    etherscanLink = "https://rinkeby.etherscan.io/address/";
  }

  return (
    <a
      href={`${etherscanLink}${contractAddress}`}
      target="_blank"
      className="text-blue-cyan flex"
      rel="noreferrer"
    >
      View on Etherscan <ExternalLinkIcon className="ml-2" />
    </a>
  );
};
