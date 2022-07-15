import GUARD_MIXIN_MANAGER_ABI from '@/contracts/GuardMixinManager.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class GuardMixinManager extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, GUARD_MIXIN_MANAGER_ABI as AbiItem[]);
  }

  public updateDefaultMixins(token: string, mixins: string[]): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'address[]',
            name: 'mixins_',
            type: 'address[]'
          }
        ],
        name: 'updateDefaultMixins',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, mixins] as string[]
    );
  }

  public allowModule(token: string, module: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'module',
            type: 'address'
          },
          {
            internalType: 'bool',
            name: 'allowed',
            type: 'bool'
          }
        ],
        name: 'updateModule',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, module, true] as string[]
    );
  }
}
