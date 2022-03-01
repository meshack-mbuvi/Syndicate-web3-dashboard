import { isDev } from "@/utils/environment";
import React, { useMemo } from "react";
import {
  ExternalLinkIcon,
  OpenExternalLinkIcon,
} from "src/components/iconWrappers";

import { useConnectWalletContext } from "../../../../context/ConnectWalletProvider";

interface LinkProp {
  resourceId: string | string[];
  customStyles?: string;
  resource?: string;
  iconOnly?: boolean;
  text?: string;
  grouped?: boolean;
  grayIcon?: boolean;
}

/** Link used to redirect the user to the Etherscan
 * This could point to either the syndicate contract
 * or the token contract when token transactions are involved.
 */
export const BlockExplorerLink: React.FC<LinkProp> = (props) => {
  const {
    resourceId: etherscanInfo,
    customStyles,
    resource: type = "address",
    iconOnly,
    grouped,
    grayIcon = false,
  } = props;

  const { chainId } = useConnectWalletContext();

  const text = useMemo(
    () => ({ 1: "Etherscan", 4: "Etherscan", 137: "Polygonscan" }[chainId]),
    [chainId],
  );

  const url = useMemo(() => {
    const baseURL = {
      1: `https://etherscan.io`,
      4: `https://rinkeby.etherscan.io`,
      137: `https://polygonscan.com`,
    }[chainId];
    const resource = type === "transaction" ? "tx" : "address";
    return [baseURL, resource, etherscanInfo].join("/");
  }, [chainId, type, etherscanInfo]);

  return (
    <a
      href={url}
      target="_blank"
      className={`text-blue hover:opacity-90 flex items-center focus:outline-none ${
        customStyles && customStyles
      }`}
      rel="noreferrer"
    >
      {grouped && iconOnly && (
        <OpenExternalLinkIcon className="text-gray-syn5 hover:text-gray-syn4" />
      )}
      {!iconOnly ? (
        <p className="flex items-center">
          {text}{" "}
          <ExternalLinkIcon
            className="ml-2 w-4 text-blue`"
            grayIcon={grayIcon}
          />
        </p>
      ) : !grouped ? (
        <ExternalLinkIcon grayIcon className="ml-2 w-4 text-blue`" />
      ) : null}
    </a>
  );
};
