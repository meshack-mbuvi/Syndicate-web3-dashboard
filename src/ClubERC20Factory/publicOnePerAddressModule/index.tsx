import publicOnePerAddressModule_ABI from 'src/contracts/PublicOnePerAddressModule.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
export class PublicOnePerAddressModuleContract {
  isGnosisSafe: boolean;
  contract;
  web3;
  activeNetwork;

  // initialize a contract instance
  constructor(contractAddress: string, web3: any, activeNetwork: any) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.contract = new web3.eth.Contract(
      publicOnePerAddressModule_ABI,
      contractAddress
    );
    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  async mint(
    forAddress: string,
    tokenAddress: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: any
  ): Promise<any> {
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) =>
      this.contract.methods
        .mint(tokenAddress)
        .send({ from: forAddress, gasPrice: gasEstimate })
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

  async hasMinted(nftAddress: any, account: any): Promise<boolean> {
    try {
      return this.contract.methods.hasMinted(nftAddress, account).call();
    } catch (error) {
      return false;
    }
  }

  getPastEvents = async (distEvent: string, filter = {}): Promise<[]> => {
    if (!distEvent.trim()) return [];
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
