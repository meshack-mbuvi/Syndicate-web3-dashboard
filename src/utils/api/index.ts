import axios from 'axios';
import { BACKEND_LINKS } from '@/Networks/backendLinks';

export const proxyGet = async (chainId: number, path: string, params: any) => {
  return await axios.get(`${BACKEND_LINKS[chainId].apiServer}/${path}`, {
    params
  });
};
