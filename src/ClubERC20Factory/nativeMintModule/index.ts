import NativeMintModule_ABI from 'src/contracts/EthMintModule.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';

export class NativeMintModuleContract {
  web3;
  address;

  // This will be used to call other functions. eg mint
  NativeMintModuleContract;

  // initialize a contract instance
  constructor(NativeMintModuleContractAddress: string, web3) {
    this.web3 = web3;
    this.address = NativeMintModuleContractAddress;
    this.init();
  }

  async init(): Promise<void> {
    if (!NativeMintModule_ABI) {
      return;
    }
    try {
      this.NativeMintModuleContract = new this.web3.eth.Contract(
        NativeMintModule_ABI,
        this.address
      );
    } catch (error) {
      this.NativeMintModuleContract = null;
    }
  }

  /**
   * When a member makes a deposit, we mint tokens equivalent to the deposit/
   * mint amount and then transfer the tokens to the caller address.
   *
   * Note: All validation should be handled before calling this method.
   *
   * @param amount
   * @param clubAddress
   * @param ownerAddress
   * @param onTxConfirm
   * @param onTxReceipt
   */
  async deposit(
    amount: string,
    clubAddress: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash
  ): Promise<void> {
    if (!this.NativeMintModuleContract) {
      this.init();
    }

    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.NativeMintModuleContract.methods
        .mint(clubAddress)
        .send({ from: ownerAddress, value: amount, gasPrice: gasEstimate })
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
      const receipt: any = await getGnosisTxnInfo(gnosisTxHash);
      setTransactionHash(receipt.transactionHash);
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }
}
