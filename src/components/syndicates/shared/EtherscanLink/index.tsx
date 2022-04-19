import { isDev } from '@/utils/environment';
import React from 'react';
import {
  ExternalLinkColor,
  ExternalLinkIcon,
  OpenExternalLinkIcon
} from 'src/components/iconWrappers';

interface LinkProp {
  etherscanInfo: string | string[];
  customStyles?: string;
  type?: string;
  iconOnly?: boolean;
  text?: string;
  grouped?: boolean;
  iconcolor?: ExternalLinkColor;
}

/** Link used to redirect the user to the Etherscan
 * This could point to either the syndicate contract
 * or the token contract when token transactions are involved.
 */
export const EtherscanLink: React.FC<LinkProp> = (props) => {
  const {
    etherscanInfo,
    customStyles,
    type = 'address',
    iconOnly,
    text = 'View on Etherscan',
    grouped,
    iconcolor = ExternalLinkColor.BLUE
  } = props;

  // get debug mode from the .env
  // If we're in debug mode, we'll use the rinkeby testnet.
  let etherscanLink = `https://etherscan.io/${
    type === 'transaction' ? 'tx' : 'address'
  }/`;

  if (isDev) {
    etherscanLink = `https://rinkeby.etherscan.io/${
      type === 'transaction' ? 'tx' : 'address'
    }/`;
  }

  return (
    <a
      href={`${etherscanLink}${etherscanInfo}`}
      target="_blank"
      className={`hover:opacity-90 flex items-center focus:outline-none ${
        customStyles && customStyles
      }`}
      rel="noreferrer"
    >
      {grouped && iconOnly && (
        <OpenExternalLinkIcon className="text-gray-syn5 hover:text-gray-syn4" />
      )}
      {!iconOnly ? (
        <div className="flex justify-between items-center w-full">
          <div
            className={`${
              iconcolor === ExternalLinkColor.BLUE ? 'text-blue' : 'text-white'
            }`}
          >
            {text}
          </div>
          <ExternalLinkIcon
            className={`ml-2 w-4 text-blue`}
            iconcolor={iconcolor}
          />
        </div>
      ) : !grouped ? (
        <ExternalLinkIcon grayIcon className={`ml-2 w-4 text-blue`} />
      ) : null}
    </a>
  );
};
