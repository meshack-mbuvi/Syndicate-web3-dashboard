import { IWeb3 } from '@/state/wallet/types';
import RugUtilityPropertiesABI from 'src/contracts/RugUtilityProperties.json';
import { Contract } from 'web3-eth-contract';
export class RugUtilityProperties {
  contract: Contract;
  isGnosisSafe: boolean;

  constructor(contractAddress: string, web3: IWeb3) {
    this.contract = new web3.eth.Contract(
      RugUtilityPropertiesABI as AbiItem[],
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
