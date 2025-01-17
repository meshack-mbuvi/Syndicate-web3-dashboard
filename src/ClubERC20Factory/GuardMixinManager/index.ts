import GUARD_MIXIN_MANAGER_ABI from '@/contracts/GuardMixinManager.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class GuardMixinManager extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, GUARD_MIXIN_MANAGER_ABI as AbiItem[]);
  }

  // Set Default Mixins
  public setDefaultMixins(token: string, mixins: string[]): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateDefaultMixins') as AbiItem,
      [token, mixins] as string[]
    );
  }

  public async updateDefaultMixins(
    account: string,
    token: string,
    mixins: string[],
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: any) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.updateDefaultMixins(token, mixins),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  // Allow Eth Price module
  public setAllowModule(token: string, module: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateModule') as AbiItem,
      [token, module, true] as string[]
    );
  }

  public async isModuleAllowed(
    token: string,
    moduleAddress: string
  ): Promise<boolean> {
    const reqs = await this.contract.methods
      .moduleRequirements(token, moduleAddress)
      .call();
    return reqs.length > 0;
  }

  // set custom mixins
  public setModuleMixins(
    token: string,
    module: string,
    mixins: string[]
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateModuleMixins') as AbiItem,
      [token, module, mixins] as string[]
    );
  }

  public async getModuleRequirements(
    token: string,
    moduleAddress: string
  ): Promise<string[]> {
    return await this.contract.methods
      .moduleRequirements(token, moduleAddress)
      .call();
  }
}
