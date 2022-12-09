import { NETWORKS } from '@/Networks';
import { INetwork } from '@/Networks/networks';
import _ from 'lodash';

export const useGetNetworkById = (chainId: any): INetwork => {
  const network: any = _.find(NETWORKS, (el) => el.chainId === chainId);

  return network;
};

export const useGetNetwork = (name: any): INetwork => {
  const network: any = _.find(NETWORKS, (el) => el.network === name);

  return network;
};
