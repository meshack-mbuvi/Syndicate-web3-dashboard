import FIXED_RENDERER_ABI from '@/contracts/FixedRenderer.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class FixedRenderer extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, FIXED_RENDERER_ABI as AbiItem[]);
  }

  public updateTokenURI(token: string, uri: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'collective',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string'
          }
        ],
        name: 'updateTokenURI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, uri]
    );
  }
}
