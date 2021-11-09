import React from "react";
import {
  ExternalLinkIcon,
  OpenExternalLinkIcon,
} from "src/components/iconWrappers";
import { isDev } from "@/utils/environment";

interface LinkProp {
  etherscanInfo: string | string[];
  customStyles?: string;
  type?: string;
  iconOnly?: boolean;
  text?: string;
  grouped?: boolean;
}

/** Link used to redirect the user to the Etherscan
 * This could point to either the syndicate contract
 * or the token contract when token transactions are involved.
 */
export const EtherscanLink: React.FC<LinkProp> = (props) => {
  const {
    etherscanInfo,
    customStyles,
    type = "address",
    iconOnly,
    text = "Etherscan",
    grouped,
  } = props;
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
      className={`text-blue hover:opacity-90 flex items-center ${
        customStyles && customStyles
      }`}
      rel="noreferrer"
    >
      {grouped && iconOnly && (
        <OpenExternalLinkIcon color="text-gray-syn5 hover:text-gray-syn4" />
      )}
      {!iconOnly ? (
        <p className="flex items-center">
          {text} <ExternalLinkIcon className="ml-2 w-4 text-blue" />
        </p>
      ) : !grouped ? (
        <ExternalLinkIcon grayIcon className="ml-2 w-4 text-blue" />
      ) : null}
    </a>
  );
};
