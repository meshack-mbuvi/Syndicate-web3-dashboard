import MAX_PER_MEMBER_ERC721_ABI from '@/contracts/MaxPerMemberERC721.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import { ContractBase } from '../ContractBase';

export class MaxPerMemberERC721 extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, MAX_PER_MEMBER_ERC721_ABI as AbiItem[]);
  }

  public setMaxPerMemberRequirements(
    token: string,
    maxPerMember: number
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('setMixinRequirements') as AbiItem,
      [token, maxPerMember] as string[]
    );
  }

  public async updateMaxPerMember(
    account: string,
    token: string,
    maxPerMember: number,
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: any) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.setMixinRequirements(token, maxPerMember),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    token: string,
    maxPerMember: number,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.setMixinRequirements(token, maxPerMember),
      onResponse
    );
  }
}
