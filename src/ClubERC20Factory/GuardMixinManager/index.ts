import GUARD_MIXIN_MANAGER_ABI from '@/contracts/GuardMixinManager.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class GuardMixinManager extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, GUARD_MIXIN_MANAGER_ABI as AbiItem[]);
  }

  public setDefaultMixins(token: string, mixins: string[]): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateDefaultMixins'),
      [token, mixins] as string[]
    );
  }

  public setAllowModule(token: string, module: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateModule'),
      [token, module, true] as string[]
    );
  }
}
