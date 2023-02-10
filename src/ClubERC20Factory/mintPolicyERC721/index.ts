import MintPolicyABI from 'src/contracts/PolicyMintERC721.json';

export class ERC721MintPolicyContract {
  web3;
  mintPolicyERC721Contract;

  constructor(mintPolicyAddress: string, web3: Web3) {
    this.web3 = web3;
    this.mintPolicyERC721Contract = new this.web3.eth.Contract(
      MintPolicyABI as AbiItem[],
      mintPolicyAddress
    );
  }

  async isModuleAllowed(
    clubAddress: string,
    moduleAddress: string
  ): Promise<boolean> {
    return this.mintPolicyERC721Contract.methods
      .allowedModules(clubAddress, moduleAddress)
      .call();
  }
}
