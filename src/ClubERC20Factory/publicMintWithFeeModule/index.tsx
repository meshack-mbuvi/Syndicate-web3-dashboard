import publicMintWithFeeModule_ABI from 'src/contracts/PublicMintWithFeeModule.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';
export class PublicMintWithFeeModuleContract {
  isGnosisSafe: boolean;
  contract;
  web3;
  activeNetwork;

  // initialize a contract instance
  constructor(contractAddress: string, web3: any, activeNetwork: any) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.contract = new web3.eth.Contract(
      publicMintWithFeeModule_ABI,
      contractAddress
    );
    this.isGnosisSafe =
      web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig';
  }

  async mint(
    forAddress: string,
    tokenAddress: string,
    value: string,
    amount: number,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: any
  ): Promise<any> {
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) =>
      this.contract.methods
        .mint(tokenAddress, amount)
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

  async amountMinted(nftAddress: any, account: any): Promise<number> {
    try {
      return this.contract.methods.amountMinted(nftAddress, account).call();
    } catch (error) {
      return 0;
    }
  }

  async nativePrice(nftAddress: any): Promise<string> {
    try {
      return this.contract.methods.ethPrice(nftAddress).call();
    } catch (error) {
      return '';
    }
  }

  async startTime(nftAddress: any): Promise<string> {
    try {
      return this.contract.methods.startTime(nftAddress).call();
    } catch (error) {
      return '';
    }
  }

  async publicSupply(nftAddress: any): Promise<number> {
    try {
      return this.contract.methods.publicSupply(nftAddress).call();
    } catch (error) {
      return 0;
    }
  }

  async maxPerAddress(nftAddress: any): Promise<number> {
    try {
      return this.contract.methods.maxPerAddress(nftAddress).call();
    } catch (error) {
      return 0;
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
