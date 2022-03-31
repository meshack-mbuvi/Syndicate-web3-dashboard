import DepositTokenMintModule_ABI from 'src/contracts/DepositTokenMintModule.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class DepositTokenMintModuleContract {
  web3;
  address;

  // This will be used to call other functions. eg mint
  DepositTokenMintModuleContract;

  // initialize a contract instance
  constructor(DepositTokenMintModuleContractAddress: string, web3) {
    this.web3 = web3;
    this.address = DepositTokenMintModuleContractAddress;
    this.init();
  }

  async init(): Promise<void> {
    if (!DepositTokenMintModule_ABI) {
      return;
    }
    try {
      this.DepositTokenMintModuleContract = new this.web3.eth.Contract(
        DepositTokenMintModule_ABI,
        this.address
      );
    } catch (error) {
      this.DepositTokenMintModuleContract = null;
    }
  }

  async depositToken(clubAddress: string): Promise<string> {
    try {
      return this.DepositTokenMintModuleContract.methods
        .depositToken(clubAddress)
        .call();
    } catch (error) {
      return '';
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
    if (!this.DepositTokenMintModuleContract) {
      this.init();
    }

    let gnosisTxHash;

    await new Promise((resolve, reject) => {
      this.DepositTokenMintModuleContract.methods
        .mint(clubAddress, amount)
        .send({ from: ownerAddress })
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
