import { Web3Provider } from '@ethersproject/providers';
import { useQuery } from '@tanstack/react-query';

export const getAssets = async (
  account: string,
  ethersProvider: Web3Provider
) => {
  const ensName = await ethersProvider.lookupAddress(account);
  if (!ensName) {
    return null;
  }

  return (await ethersProvider.getResolver(ensName))
    .getAvatar()
    .then((res) => {
      return {
        name: ensName,
        avatar: res?.url
      };
    })
    .catch(() => {
      return {
        name: ensName,
        avatar: null
      };
    });
};

const useFetchEnsAssets = (account: string, ethersProvider: Web3Provider) => {
  return useQuery(
    [account, ethersProvider.network.chainId],
    () => getAssets(account, ethersProvider),
    {
      enabled: !!ethersProvider
    }
  );
};

export default useFetchEnsAssets;
