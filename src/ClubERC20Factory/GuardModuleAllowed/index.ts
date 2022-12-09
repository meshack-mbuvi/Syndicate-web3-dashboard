import GUARD_MODULE_ALLOWED_ABI from '@/contracts/GuardModuleAllowed.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class GuardModuleAllowed extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, GUARD_MODULE_ALLOWED_ABI as AbiItem[]);
  }

  public encodeUpdateModule(
    dealToken: string,
    precommitAddress: string,
    allowed: boolean
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateModule') as AbiItem,
      [dealToken, precommitAddress, allowed] as string[]
    );
  }
}
