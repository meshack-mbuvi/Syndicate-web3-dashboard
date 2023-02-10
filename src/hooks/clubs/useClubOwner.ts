import { ClubERC20Contract } from '@/ClubERC20Factory/clubERC20';
import { IActiveNetwork, IWeb3 } from '@/state/wallet/types';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

/**
 * @dev This hook is used to check whether a given account is an owner of a
 * given erc20 token. Please note this method can be modified to include check
 * for collectives( erc721 )
 *
 * @param contractAddress contract address of the erc20
 * @param web3 web3 provider object
 * @param activeNetwork object containing details of the active network like
 * chainId and such.
 * @param account wallet address connected to the app
 * @returns {isOwner} an object with isOwner key which is a boolean to indicate
 * whether the account is an owner of the token or not.
 */
export const useTokenOwner = (
  contractAddress: string,
  web3: IWeb3 | null,
  activeNetwork: IActiveNetwork,
  account: string
): { isOwner: boolean; isLoading: boolean } => {
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (
      !contractAddress ||
      !account ||
      !web3 ||
      isEmpty(web3) ||
      isEmpty(activeNetwork)
    )
      return;

    const token = new ClubERC20Contract(contractAddress, web3, activeNetwork);

    token
      .owner()
      .then((owner) => {
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsOwner(false);
      });
  }, [contractAddress, account, web3, activeNetwork]);

  return { isOwner, isLoading };
};

export const getMemberBalance = async (
  contractAddress: string,
  account: string,
  web3: IWeb3,
  activeNetwork: IActiveNetwork
): Promise<number> => {
  if (!contractAddress || !account || !web3) return 0;

  try {
    const club = new ClubERC20Contract(contractAddress, web3, activeNetwork);
    return parseInt(await club.balanceOf(account));
  } catch (error) {
    return 0;
  }
};
