import RugUtilityPropertiesABI from 'src/contracts/RugUtilityProperties.json';

export class RugUtilityProperties {
  contract;
  isGnosisSafe: boolean;

  constructor(contractAddress: string, web3: any) {
    this.contract = new web3.eth.Contract(
      RugUtilityPropertiesABI,
      contractAddress
    );
    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  /**
   * Function that retrieves rate of RUG token production
   * for a given token_id per day
   */
  getProduction = async (tokenId: string): Promise<string> =>
    this.contract.methods.getProduction(tokenId).call();
}
