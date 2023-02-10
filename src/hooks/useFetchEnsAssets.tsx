import { Web3Provider } from '@ethersproject/providers';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const getAssets = async (
  account: string,
  ethersProvider: Web3Provider | null
): Promise<{
  name: string;
  avatar: string | undefined;
} | void | null> => {
  if (!ethersProvider) return;

  const ensName = await ethersProvider.lookupAddress(account);
  if (!ensName) {
    return null;
  }
  // @ts-expect-error TS(2531): Object is possibly 'null'.
  return (await ethersProvider?.getResolver(ensName))
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

const useFetchEnsAssets = (
  account: string,
  ethersProvider: Web3Provider | null
): UseQueryResult<{ name: string; avatar: string | undefined }> => {
  return useQuery(
    [account, ethersProvider?.network?.chainId],
    () => getAssets(account, ethersProvider),
    {
      enabled: !!ethersProvider
    }
  );
};

export default useFetchEnsAssets;
