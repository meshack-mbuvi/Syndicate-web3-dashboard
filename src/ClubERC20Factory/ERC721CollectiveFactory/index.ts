import ERC721_Collective_Factory_ABI from 'src/contracts/ERC721CollectiveFactory.json';
import { IActiveNetwork } from '@/state/wallet/types';

export class ERC721CollectiveFactory {
  web3;
  address;
  activeNetwork;
  erc721CollectiveFactory;

  // initialize new instance of ERC721CollectiveFactory
  constructor(
    erc721CollectiveFactoryAddress: string,
    web3: Web3,
    activeNetwork: IActiveNetwork
  ) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = erc721CollectiveFactoryAddress;
    this.init();
  }

  init(): void {
    try {
      this.erc721CollectiveFactory = new this.web3.eth.Contract(
        ERC721_Collective_Factory_ABI,
        this.address
      );
    } catch (error) {
      this.erc721CollectiveFactory = null;
    }
  }
}
