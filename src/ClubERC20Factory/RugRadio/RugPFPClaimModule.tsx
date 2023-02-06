import RugPFPClaimModule_ABI from 'src/contracts/RugPFPClaimModule.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class RugPFPClaimModuleContract {
  contract;
  isGnosisSafe: boolean;
  activeNetwork;
  web3;

  constructor(
    contractAddress: string,
    rugPFPAddress: string,
    web3: any,
    activeNetwork: any
  ) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.contract = new web3.eth.Contract(
      RugPFPClaimModule_ABI,
      contractAddress,
      rugPFPAddress
    );

    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  /**
   * Function that calculates the amount of tokens that can be claimed for a given RR Genesis NFT
   *
   * @param tokenIds Genesis NFT ID's
   * @returns Array of available claim amounts
   */
  getMintsRemainingPerNFTs = async (tokenIds: string[]): Promise<string> =>
    this.contract.methods.getMintsRemainingPerNFTs(tokenIds).call();

  /**
   * Function that mints/claims the available amount of tokens for a given RR Genesis NFT
   * @param tokenIds Genesis NFT ID's
   * @param amounts Amounts to claim
   */
  redeemMany = async (
    tokenIds: string[],
    amounts: number[],
    fromAddress: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: (transactionHash: string) => void
  ): Promise<string> => {
    const gasEstimate = await estimateGas(this.web3);

    return new Promise((resolve, reject) =>
      this.contract.methods
        .redeemMany(tokenIds, amounts)
        .send({ from: fromAddress, gasPrice: gasEstimate })
        .on('receipt', onTxReceipt)
        .on('error', onTxFail)
        .on('transactionHash', async (transactionHash: string) => {
          onTxConfirm(transactionHash);

          if (!this.isGnosisSafe) {
            setTransactionHash(transactionHash);
          } else {
            setTransactionHash('');

            // Stop waiting if we are connected to gnosis safe via walletConnect
            const receipt = await getGnosisTxnInfo(
              transactionHash,
              this.activeNetwork
            );

            if (!(receipt as { isSuccessful: boolean }).isSuccessful) {
              return reject('Receipt failed');
            }

            onTxReceipt(receipt);
          }
        })
    );
  };
}
