import MintPolicyABI from "src/contracts/MintPolicy.json";

export class MintPolicyContract {
  web3;
  // This will be used to call other functions. eg mint
  mintPolicyContract;

  constructor(mintPolicyAddress: string, web3: Web3) {
    this.web3 = web3;
    this.mintPolicyContract = new this.web3.eth.Contract(
      MintPolicyABI,
      mintPolicyAddress,
    );
  }

  /**
   * Returns a number of mint parameters for the clubERC20.
   * These include mint timelines, clubERC20 supply, maxMemberCount, and other deposit requirements.
   * @returns
   */
  async getSyndicateValues(address: string): Promise<{
    endTime;
    maxMemberCount;
    maxTotalSupply;
    requiredToken;
    requiredTokenMinBalance;
    startTime;
  }> {
    return this.mintPolicyContract.methods.configOf(address).call();
  }

  async isModuleAllowed(
    clubAddress: string,
    moduleAddress: string,
  ): Promise<boolean> {
    return this.mintPolicyContract.methods
      .allowedModules(clubAddress, moduleAddress)
      .call();
  }
}
