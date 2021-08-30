import React from "react";
import { ExternalLinkIcon } from "src/components/iconWrappers";
import { isDev } from "@/utils/environment";

interface LinkProp {
  etherscanInfo: string | string[];
  customStyles?: string;
  type?: string;
}

/** Link used to redirect the user to the Etherscan
 * This could point to either the syndicate contract
 * or the token contract when token transactions are involved.
 */
export const EtherscanLink: React.FC<LinkProp> = props => {
  const { etherscanInfo, customStyles, type = "address" } = props;
  // get debug mode from the .env
  // If we're in debug mode, we'll use the rinkeby testnet.
  let etherscanLink = `https://etherscan.io/${
    type === "transaction" ? "tx" : "address"
  }/`;
  if (isDev) {
    etherscanLink = `https://rinkeby.etherscan.io/${
      type === "transaction" ? "tx" : "address"
    }/`;
  }

  return (
    <a
      href={`${etherscanLink}${etherscanInfo}`}
      target="_blank"
      className={`text-blue flex items-center ${customStyles && customStyles}`}
      rel="noreferrer"
    >
      View on Etherscan <ExternalLinkIcon className="ml-2 w-4 text-blue" />
    </a>
  );
};
