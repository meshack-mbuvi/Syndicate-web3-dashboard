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
      {
        inputs: [
          {
            internalType: 'address',
            name: 'token',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'maxPerMember_',
            type: 'uint256'
          }
        ],
        name: 'setMixinRequirements',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, maxPerMember] as string[]
    );
  }
}
