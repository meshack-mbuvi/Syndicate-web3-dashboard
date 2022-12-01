import MIN_PER_MEMBER_ERC20_ABI from '@/contracts/MinPerMemberERC20.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';
import { TransactionReceipt } from 'web3-core';

export class MinPerMemberERC20Mixin extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, MIN_PER_MEMBER_ERC20_ABI as AbiItem[]);
  }

  public encodeSetMinPerMemberRequirement(
    dealToken: string,
    minPerMember: number
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('setMixinRequirements') as AbiItem,
      [dealToken, minPerMember] as string[]
    );
  }

  public async updateMinPerMember(
    account: string,
    dealToken: string,
    minPerMember: number,
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.setMixinRequirements(dealToken, minPerMember),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    dealToken: string,
    minPerMember: number,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.setMixinRequirements(dealToken, minPerMember),
      onResponse
    );
  }
}
