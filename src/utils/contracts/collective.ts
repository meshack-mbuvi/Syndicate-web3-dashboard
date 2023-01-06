import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';

export const getCollectiveBalance = async (
  collectiveAddress: string,
  account: string,
  web3: Web3
): Promise<number> => {
  return parseInt(
    await new ERC721Contract(collectiveAddress, web3).balanceOf(account)
  );
};

export const getCollectiveOwner = async (
  collectiveAddress: string,
  web3: Web3
): Promise<string> => {
  return await new ERC721Contract(collectiveAddress, web3).owner();
};

export const getCollectiveName = async (
  collectiveAddress: string,
  web3: Web3
) => {
  return await new ERC721Contract(collectiveAddress, web3).name();
};
