import TIME_REQUIREMENTS_ABI from '@/contracts/TimeRequirements.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import { ContractBase } from '../ContractBase';

export class TimeRequirements extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, TIME_REQUIREMENTS_ABI as AbiItem[]);
  }

  public setTimeRequirements(
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
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: any) => void,
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
    onResponse: Dispatch<SetStateAction<number>>
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
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: any) => void,
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
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.closeTimeWindow(token),
      onResponse
    );
  }
}
