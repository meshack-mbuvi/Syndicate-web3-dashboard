import OwnerMintModule_ABI from 'src/contracts/OwnerMintModule.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';

export class OwnerMintModuleContract {
  web3;
  address;
  activeNetwork;

  // This will be used to call other functions.
  OwnerMintModuleContract;

  // initialize a contract instance
  constructor(OwnerMintModuleContractAddress: string, web3, activeNetwork) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = OwnerMintModuleContractAddress;
    this.init();
  }

  async init(): Promise<void> {
    if (!OwnerMintModule_ABI) {
      return;
    }
    try {
      this.OwnerMintModuleContract = new this.web3.eth.Contract(
        OwnerMintModule_ABI,
        this.address
      );
    } catch (error) {
      this.OwnerMintModuleContract = null;
    }
  }

  /**
   * Allow managers to mint club tokens to members
   *
   * Note: All validation should be handled before calling this method.
   *
   * @param amount
   * @param clubAddress
   * @param memberAddress
   * @param ownerAddress
   * @param onTxConfirm
   * @param onTxReceipt
   */
  async ownerMint(
    amount: string,
    clubAddress: string,
    memberAddress: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash: (txHas) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.OwnerMintModuleContract.methods
        .ownerMint(clubAddress, memberAddress, amount)
        .send({ from: ownerAddress, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash) => {
          onTxConfirm(transactionHash);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            setTransactionHash('');
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          } else {
            setTransactionHash(transactionHash);
          }
        })
        .on('receipt', (receipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error) => {
          onTxFail(error);
          reject(error);
        });
    });
    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(
        gnosisTxHash,
        this.activeNetwork
      );
      setTransactionHash(receipt.transactionHash);
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }
}
