import React, { useMemo } from 'react';
import {
  ExternalLinkColor,
  ExternalLinkIcon,
  OpenExternalLinkIcon
} from 'src/components/iconWrappers';

import { useConnectWalletContext } from '../../../../context/ConnectWalletProvider';

interface LinkProp {
  resourceId: string | string[];
  customStyles?: string;
  resource?: string;
  iconOnly?: boolean;
  prefix?: string;
  suffix?: string;
  grouped?: boolean;
  iconColor?: ExternalLinkColor;
}

/** Link used to redirect the user to the Block Explorer
 * This could point to either the syndicate contract
 * or the token contract when token transactions are involved.
 */
export const BlockExplorerLink: React.FC<LinkProp> = (props) => {
  const {
    resourceId: explorerInfo,
    customStyles,
    resource: type = 'address',
    iconOnly,
    prefix = 'View on ',
    suffix = '',
    grouped,
    iconColor = ExternalLinkColor.BLUE
  } = props;

  const { activeNetwork } = useConnectWalletContext();

  const url = useMemo(() => {
    const baseURL = activeNetwork.blockExplorer.baseUrl;
    const resource =
      type === 'transaction'
        ? activeNetwork.blockExplorer.resources.transaction
        : activeNetwork.blockExplorer.resources.address;
    return [baseURL, resource, explorerInfo].join('/');
  }, [activeNetwork, type, explorerInfo]);

  return (
    <a
      href={url}
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
              iconColor === ExternalLinkColor.BLUE ? 'text-blue' : 'text-white'
            }`}
          >
            {prefix} {activeNetwork.blockExplorer.name} {suffix}
          </div>
          <ExternalLinkIcon
            className={`ml-2 w-4 text-blue`}
            iconColor={iconColor}
          />
        </div>
      ) : !grouped ? (
        <ExternalLinkIcon grayIcon className="ml-2 w-4 text-blue`" />
      ) : null}
    </a>
  );
};
