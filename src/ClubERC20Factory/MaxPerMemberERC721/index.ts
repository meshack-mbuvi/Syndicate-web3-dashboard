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
      this.getAbiObject('setMixinRequirements'),
      [token, maxPerMember] as string[]
    );
  }
}
