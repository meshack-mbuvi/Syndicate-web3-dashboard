import React, { useMemo } from 'react';
import {
  ExternalLinkColor,
  ExternalLinkIcon
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
  iconcolor?: ExternalLinkColor;
  iconOnlyStyles?: string;
  noIconOrText?: boolean;
  children?: React.ReactNode;
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
    iconcolor = ExternalLinkColor.BLUE,
    noIconOrText = false,
    children
  } = props;

  const { activeNetwork } = useConnectWalletContext();

  const url = useMemo(() => {
    const baseURL = activeNetwork?.blockExplorer?.baseUrl;
    const resource =
      type === 'transaction'
        ? activeNetwork?.blockExplorer.resources.transaction
        : activeNetwork?.blockExplorer.resources.address;
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
      {noIconOrText ? (
        children
      ) : (
        <>
          {grouped && iconOnly && <ExternalLinkIcon iconcolor={iconcolor} />}
          {!iconOnly ? (
            <div className="flex justify-between items-center w-full">
              <div
                className={`${
                  iconcolor === ExternalLinkColor.BLUE
                    ? 'text-blue'
                    : 'text-white'
                }`}
              >
                {prefix} {activeNetwork?.blockExplorer.name} {suffix}
              </div>
              <ExternalLinkIcon
                className={`ml-2 w-4 text-blue`}
                iconcolor={iconcolor}
              />
            </div>
          ) : !grouped ? (
            <ExternalLinkIcon grayIcon className="ml-2 w-4 text-blue`" />
          ) : null}
        </>
      )}
    </a>
  );
};
