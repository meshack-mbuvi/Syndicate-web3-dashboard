import { Resolver } from '@ethersproject/providers';
import { useQuery } from '@tanstack/react-query';

export const getAssets = async (ensResolver: Resolver) => {
  return ensResolver.getAvatar().then((res) => {
    return {
      name: ensResolver.name,
      avatar: res?.url
    };
  });
};

const useFetchEnsAssets = (ensResolver: Resolver) => {
  return useQuery(['ensAssets'], () => getAssets(ensResolver), {
    enabled: !!ensResolver
  });
};

export default useFetchEnsAssets;
