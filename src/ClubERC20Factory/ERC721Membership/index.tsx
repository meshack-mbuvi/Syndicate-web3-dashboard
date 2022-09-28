import ERC721Membership_ABI from 'src/contracts/ERC721Membership.json';

export class ERC721Contract {
  web3;
  address;

  // This will be used to call other functions.
  erc721Contract: any;

  // initialize an erc20 contract instance
  constructor(erc721MembershipContractAddress: string, web3: any) {
    this.web3 = web3;
    this.address = erc721MembershipContractAddress;
    this.init();
  }

  async init(): Promise<void> {
    if (!ERC721Membership_ABI) {
      return;
    }
    try {
      this.erc721Contract = new this.web3.eth.Contract(
        ERC721Membership_ABI,
        this.address
      );
    } catch (error) {
      this.erc721Contract = null;
    }
  }

  async name(): Promise<string> {
    try {
      return this.erc721Contract.methods.name().call();
    } catch (error) {
      return '';
    }
  }

  async symbol(): Promise<string> {
    try {
      return this.erc721Contract.methods.symbol().call();
    } catch (error) {
      return '';
    }
  }

  async owner(): Promise<string> {
    try {
      return this.erc721Contract.methods.owner().call();
    } catch (error) {
      return '';
    }
  }

  async maxSupply(): Promise<string> {
    try {
      return this.erc721Contract.methods.maxSupply().call();
    } catch (error) {
      return '';
    }
  }

  async currentSupply(): Promise<string> {
    try {
      return this.erc721Contract.methods.currentSupply().call();
    } catch (error) {
      return '';
    }
  }

  async rendererAddr(): Promise<string> {
    try {
      return this.erc721Contract.methods.rendererAddr().call();
    } catch (error) {
      return '';
    }
  }

  async balanceOf(address: any): Promise<string> {
    try {
      return await this.erc721Contract.methods.balanceOf(address).call();
    } catch (error) {
      return '';
    }
  }

  async ownerOf(tokenId: any): Promise<string> {
    try {
      return this.erc721Contract.methods.ownerOf(tokenId).call();
    } catch (error) {
      return '';
    }
  }
}
