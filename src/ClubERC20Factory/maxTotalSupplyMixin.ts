import { IActiveNetwork } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import MaxTotalSupply_ABI from 'src/contracts/MaxTotalSupply.json';
import { ContractBase } from './ContractBase';

export class MaxTotalSupplyMixin extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, MaxTotalSupply_ABI as AbiItem[]);
  }

  public setTotalSupplyRequirements(
    token: string,
    totalSupply: string
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('setMixinRequirements') as AbiItem,
      [token, totalSupply] as string[]
    );
  }

  public async getMaxTotalSupply(token: string): Promise<number> {
    return await this.contract.methods.maxTotalSupply(token).call();
  }

  public async updateTotalSupply(
    account: string,
    token: string,
    totalSupply: string,
    onTxConfirm: (transactionHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: string) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.setMixinRequirements(token, totalSupply),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    token: string,
    totalSupply: number | string,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.setMixinRequirements(token, totalSupply),
      onResponse
    );
  }
}
