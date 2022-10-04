import MintPolicyABI from 'src/contracts/PolicyMintERC721.json';

export class ERC721MintPolicyContract {
  web3;
  mintPolicyERC721Contract;

  constructor(mintPolicyAddress: string, web3: Web3) {
    this.web3 = web3;
    this.mintPolicyERC721Contract = new this.web3.eth.Contract(
      // @ts-expect-error TS(2345): Argument of type '({ anonymous: boolean; inputs: {... Remove this comment to see the full error message
      MintPolicyABI,
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
