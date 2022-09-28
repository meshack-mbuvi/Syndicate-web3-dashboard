import RugERC20ClaimModule_ABI from 'src/contracts/RugERC20ClaimModule.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class RugERC20ClaimModule {
  contract;
  isGnosisSafe: boolean;
  activeNetwork;
  web3;

  constructor(
    contractAddress: string,
    rugToken: string,
    genesisNFT: string,
    properties: string,
    web3: any,
    activeNetwork: any
  ) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.contract = new web3.eth.Contract(
      RugERC20ClaimModule_ABI,
      contractAddress,
      rugToken,
      genesisNFT,
      properties
    );

    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  /**
   * Function that calculates the amount of tokens a tokenId has available to claim
   *
   * @param tokenId Genesis NFT ID
   * @returns The amount tokens to claim
   */
  getClaimAmount = async (tokenId: string): Promise<string> =>
    this.contract.methods.getClaimAmount(tokenId).call();

  /**
   * Retrieve start time for token claims
   * @returns
   */
  getStartTime = async (): Promise<string> =>
    this.contract.methods.startTime().call();

  getLastClaimTime = async (tokenId: string): Promise<string> =>
    this.contract.methods.lastClaim(tokenId).call();

  /**
   * Function that mints/claims the available amount of tokens for a given RR Genesis NFT
   * @param tokenId Genesis NFT ID
   */
  claimTokens = async (
    tokenId: string,
    fromAddress: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: (transactionHash: string) => void
  ): Promise<string> => {
    const gasEstimate = estimateGas(this.web3);
    return new Promise((resolve, reject) =>
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
  };

  /**
   * Function that bulk mints/claims for an array of Genesis token Ids
   *
   * @param tokenIds Array of Genesis NFT IDs
   * @param fromAddress
   * @param onTxConfirm
   * @param onTxReceipt
   * @param onTxFail
   * @param setTransactionHash
   */
  bulkClaimTokens = async (
    tokenIds: string[],
    fromAddress: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: (transactionHash: string) => void
  ): Promise<string> => {
    const gasEstimate = await estimateGas(this.web3);
    return new Promise((_resolve, reject) =>
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
  };
}
