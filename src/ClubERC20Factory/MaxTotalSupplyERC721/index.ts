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
      this.getAbiObject('setMixinRequirements'),
      [token, number] as string[]
    );
  }
}
