import rugUtilityMintModule_ABI from 'src/contracts/RugUtilityMintModule.json';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
import { estimateGas } from '../shared/getGasEstimate';
export class RugUtilityMintModuleContract {
  isGnosisSafe: boolean;
  contract;
  web3;

  // initialize a contract instance
  constructor(contractAddress: string, web3: any) {
    this.web3 = web3;
    this.contract = new web3.eth.Contract(
      rugUtilityMintModule_ABI,
      contractAddress
    );
    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  async redeem(
    forAddress: string,
    tokenID: number,
    value: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (error?) => void,
    setTransactionHash
  ): Promise<any> {
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) =>
      this.contract.methods
        .redeem(tokenID)
        .send({ from: forAddress, gasPrice: gasEstimate, value })
        .on('receipt', onTxReceipt)
        .on('error', onTxFail)
        .on('transactionHash', async (transactionHash: string) => {
          onTxConfirm(transactionHash);
          if (!this.isGnosisSafe) {
            setTransactionHash(transactionHash);
          } else {
            setTransactionHash('');
            // Stop waiting if we are connected to gnosis safe via walletConnect
            const receipt = await getGnosisTxnInfo(transactionHash);
            if (!(receipt as { isSuccessful: boolean }).isSuccessful) {
              return reject('Receipt failed');
            }

            onTxReceipt(receipt);
          }
        })
    );
  }

  async redeemMany(
    forAddress: string,
    tokenIDs: [],
    value: string,
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt, tokenIDs) => void,
    onTxFail: (error?) => void,
    setTransactionHash
  ): Promise<any> {
    const gasEstimate = await estimateGas(this.web3);

    new Promise((resolve, reject) =>
      this.contract.methods
        .redeemMany(tokenIDs)
        .send({ from: forAddress, gasPrice: gasEstimate, value })
        .on('receipt', async (receipt) => {
          onTxReceipt(receipt, tokenIDs);
        })
        .on('error', onTxFail)
        .on('transactionHash', async (transactionHash: string) => {
          onTxConfirm(transactionHash);
          if (!this.isGnosisSafe) {
            setTransactionHash(transactionHash);
          } else {
            setTransactionHash('');
            // Stop waiting if we are connected to gnosis safe via walletConnect
            const receipt = await getGnosisTxnInfo(transactionHash);
            if (!(receipt as { isSuccessful: boolean }).isSuccessful) {
              return reject('Receipt failed');
            }

            onTxReceipt(receipt, tokenIDs);
          }
        })
    );
  }

  async nativePrice(): Promise<string> {
    try {
      return this.contract.methods.nativePrice().call();
    } catch (error) {
      return '';
    }
  }
  async redemptionToken(): Promise<string> {
    try {
      return this.contract.methods.redemptionToken().call();
    } catch (error) {
      return '';
    }
  }
  async membership(): Promise<string> {
    try {
      return this.contract.methods.membership().call();
    } catch (error) {
      return '';
    }
  }
  async tokenRedeemed(tokenID): Promise<boolean> {
    try {
      return this.contract.methods.tokenRedeemed(tokenID).call();
    } catch (error) {
      return false;
    }
  }

  getPastEvents = async (distEvent: string, filter = {}): Promise<[]> => {
    if (!distEvent.trim()) return;
    try {
      const events = await this.contract.getPastEvents(distEvent, {
        filter,
        fromBlock: 'earliest',
        toBlock: 'latest'
      });

      return events;
    } catch (error) {
      console.log({ error });
      return [];
    }
  };
}
