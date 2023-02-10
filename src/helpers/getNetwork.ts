import { NETWORKS } from '@/Networks';
import { INetwork } from '@/Networks/networks';
import _ from 'lodash';

export const getNetworkById = (chainId: number): INetwork | undefined => {
  const network: INetwork | undefined = _.find(
    NETWORKS,
    (el) => el.chainId === chainId
  );

  return network;
};

export const getNetworkByName = (name: any): INetwork => {
  const network: any = _.find(NETWORKS, (el) => el.network === name);

  return network;
};
