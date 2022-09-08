import { ERC721Contract } from '@/ClubERC20Factory/ERC721Membership';

export const getCollectiveBalance = async (
  collectiveAddress: string,
  account: string,
  web3: any
): Promise<number> => {
  const collective = new ERC721Contract(collectiveAddress, web3);

  return parseInt(await collective.balanceOf(account));
};

export const getCollectiveOwner = async (
  collectiveAddress: string,
  web3: any
): Promise<string> => {
  const collective = new ERC721Contract(collectiveAddress, web3);

  return await collective.owner();
};
