import { IActiveNetwork } from '@/state/wallet/types';
import MaxMemberMixin_ABI from 'src/contracts/MaxMemberCount.json';
import { ContractBase } from './ContractBase';

export class MaxMemberCountMixin extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, MaxMemberMixin_ABI as AbiItem[]);
  }

  public setMemberCountRequirements(token: string, count: number): string {
    return this.web3.eth.abi.encodeFunctionCall(
      // @ts-expect-error TS(2345): Argument of type 'AbiItem | undefined' is not assig... Remove this comment to see the full error message
      this.getAbiObject('setMixinRequirements'),
      [token, count] as string[]
    );
  }

  public async updateMaxMember(
    account: string,
    token: string,
    count: number,
    onTxConfirm: (transactionHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: string) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.setMixinRequirements(token, count),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    token: string,
    count: number,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.setMixinRequirements(token, count),
      onResponse
    );
  }
}
