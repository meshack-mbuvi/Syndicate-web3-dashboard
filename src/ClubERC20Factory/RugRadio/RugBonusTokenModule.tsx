import RugBonusTokenModule_ABI from 'src/contracts/RugBonusTokenModule.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';

export class RugBonusTokenModule {
  contract;
  isGnosisSafe: boolean;
  web3;
  activeNetwork;

  constructor(
    contractAddress: string,
    rugToken: string,
    genesisNFT: string,
    properties: string,
    web3,
    activeNetwork
  ) {
    this.activeNetwork = activeNetwork;
    this.contract = new web3.eth.Contract(
      RugBonusTokenModule_ABI,
      contractAddress,
      rugToken,
      genesisNFT,
      properties
    );
    this.web3 = web3;

    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  /**
   * Function that calculates the amount of bonus tokens a tokenId has
   *
   * @param tokenId Genesis NFT ID
   * @returns The amount tokens to claim
   */
  getClaimAmount = async (tokenId: string): Promise<string> =>
    this.contract.methods.getClaimAmount(tokenId).call();

  /**
   * Function that mints/claims the available amount of bonus tokens
   * for a given RR Genesis NFT
   *
   * @param tokenId The amount tokens claimed
   */
  async claimTokens(
    tokenId: string,
    fromAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash: (transactionHash: string) => void
  ): Promise<any> {
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) =>
      this.contract.methods
        .claimTokens(tokenId)
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
  }

  /**
   * Function that bulk mints/claims for an array of Genesis token Ids
   *
   * @param tokenIds Array of Genesis NFT IDs
   * @param fromAddress
   * @param onTxConfirm
   * @param onTxReceipt
   * @param onTxFail
   * @param setTransactionHash
   *
   * @return True if successful
   */
  async bulkClaimTokens(
    tokenIds: string[],
    fromAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash: (transactionHash: string) => void
  ): Promise<any> {
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((_resolve, reject) =>
      this.contract.methods
        .bulkClaimTokens(tokenIds)
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
  }
}
