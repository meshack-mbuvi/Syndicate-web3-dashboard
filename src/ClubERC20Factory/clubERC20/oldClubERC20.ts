import ClubERC20 from 'src/contracts/oldERC20Club.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';

export class OldClubERC20Contract {
  web3;
  address;

  // This will be used to call other functions.
  OldClubERC20Contract;

  // initialize an erc20 contract instance
  constructor(clubERC20ContractAddress: string, web3) {
    this.web3 = web3;
    this.address = clubERC20ContractAddress;
    this.init();
  }

  async init(): Promise<void> {
    if (!ClubERC20) {
      return;
    }
    try {
      this.OldClubERC20Contract = new this.web3.eth.Contract(
        ClubERC20,
        this.address
      );
    } catch (error) {
      this.OldClubERC20Contract = null;
    }
  }

  async controllerMint(
    recipientAddress: string,
    amount: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash: (txHas) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.OldClubERC20Contract.methods
        .controllerMint(recipientAddress, amount)
        .send({ from: ownerAddress, gasEstimate: gasEstimate })
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
          console.log(error);
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
