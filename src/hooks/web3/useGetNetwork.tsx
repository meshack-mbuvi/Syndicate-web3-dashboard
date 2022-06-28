import _ from 'lodash';
import { NETWORKS } from '@/Networks';

export const useGetNetworkById = (chainId): any => {
  const network: any = _.find(NETWORKS, (el) => el.chainId === chainId);

  return network;
};

export const useGetNetwork = (name): any => {
  const network: any = _.find(NETWORKS, (el) => el.network === name);

  return network;
};
