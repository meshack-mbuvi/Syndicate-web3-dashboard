import DEAL_TIME_REQUIREMENTS_ABI from '@/contracts/DealTimeRequirements.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';
import { TransactionReceipt } from 'web3-core';

export class DealTimeRequirements extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(
      address,
      web3,
      activeNetwork,
      DEAL_TIME_REQUIREMENTS_ABI as AbiItem[]
    );
  }

  public encodeSetTimeRequirements(
    token: string,
    start: string,
    end: string
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('setMixinRequirements') as AbiItem,
      [token, { startTime: start, endTime: end }] as string[]
    );
  }

  public async updateTimeRequirements(
    account: string,
    token: string,
    startTime: number,
    endTime: number,
    onTxConfirm: (transactionHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    await this.send(
      account,
      () =>
        this.contract.methods.setMixinRequirements(token, {
          startTime,
          endTime
        }),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    token: string,
    startTime: number,
    endTime: number,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () =>
        this.contract.methods.setMixinRequirements(token, {
          startTime,
          endTime
        }),
      onResponse
    );
  }

  public async getTimeRequirements(
    token: string
  ): Promise<{ startTime: number; endTime: number }> {
    return await this.contract.methods.timeWindow(token).call();
  }

  public async closeTimeWindow(
    account: string,
    token: string,
    onTxConfirm: (transactionHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.closeTimeWindow(token),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGasCloseTimeWindow(
    account: string,
    token: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.closeTimeWindow(token),
      onResponse
    );
  }
}
