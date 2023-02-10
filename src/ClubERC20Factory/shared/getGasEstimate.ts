import { IWeb3 } from '@/state/wallet/types';

export const estimateGas = async (web3: IWeb3): Promise<string> =>
  (await web3.eth.getGasPrice().then((value: string) => value)) as string;
