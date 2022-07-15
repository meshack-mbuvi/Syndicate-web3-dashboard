import ETH_PRICE_MINT_MODULE_ABI from '@/contracts/EthPriceMintModule.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class EthPriceMintModule extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, ETH_PRICE_MINT_MODULE_ABI as AbiItem[]);
  }

  public updateEthPrice(token: string, price: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      {
        inputs: [
          {
            internalType: 'address',
            name: 'collective',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'ethPrice_',
            type: 'uint256'
          }
        ],
        name: 'updateEthPrice',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
      },
      [token, price]
    );
  }
}
