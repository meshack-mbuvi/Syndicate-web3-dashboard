import MAX_TOTAL_SUPPLY_ERC721_ABI from '@/contracts/MaxTotalSupplyERC721.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class MaxTotalSupplyERC721 extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(
      address,
      web3,
      activeNetwork,
      MAX_TOTAL_SUPPLY_ERC721_ABI as AbiItem[]
    );
  }

  public setTotalSupplyRequirements(token: string, number: number): string {
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
            name: 'maxTotalSupply_',
            type: 'uint256'
          }
        ],
        name: 'setMixinRequirements',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, number] as string[]
    );
  }
}
