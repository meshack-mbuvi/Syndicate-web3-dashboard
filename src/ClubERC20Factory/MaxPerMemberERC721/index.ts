import MAX_PER_MEMBER_ERC721_ABI from '@/contracts/MaxPerMemberERC721.json';
import { IActiveNetwork } from '@/state/wallet/types';
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
      // @ts-expect-error TS(2345): Argument of type 'AbiItem | undefined' is not assi... Remove this comment to see the full error message
      this.getAbiObject('setMixinRequirements'),
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
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.setMixinRequirements(token, maxPerMember),
      onResponse
    );
  }
}
