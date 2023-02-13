import { ERC20DealFactory } from '@/ClubERC20Factory/ERC20DealFactory';
import { IActiveNetwork } from '@/state/wallet/types';

export const getDealOwner = async (
  dealAddress: string,
  web3: Web3,
  activeNetwork: IActiveNetwork
): Promise<string> => {
  return await new ERC20DealFactory(dealAddress, web3, activeNetwork).owner();
};
