import TIME_REQUIREMENTS_ABI from '@/contracts/TimeRequirements.json';
import { IActiveNetwork } from '@/state/wallet/types';
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
      this.getAbiObject('setMixinRequirements'),
      [token, { startTime: start, endTime: end }] as string[]
    );
  }

  public async updateTimeRequirements(
    account: string,
    token: string,
    startTime: number,
    endTime: number,
    onTxConfirm: (transactionHash) => void,
    onTxReceipt: (receipt) => void,
    onTxFail: (err) => void
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
}
