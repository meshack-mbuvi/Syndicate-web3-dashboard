import { CONTRACT_ADDRESSES } from '@/Networks';
import { IActiveNetwork } from '@/state/wallet/types';
import { Contract } from 'web3-eth-contract';
import { estimateGas } from './shared/getGasEstimate';
import { getGnosisTxnInfo } from './shared/gnosisTransactionInfo';

export abstract class ContractBase {
  web3: Web3;
  address: string;
  activeNetwork: IActiveNetwork;
  contract: Contract;
  abiItem: AbiItem[];
  isGnosisSafe: boolean;
  addresses: typeof CONTRACT_ADDRESSES[1 | 4 | 137];

  constructor(
    address: string,
    web3: Web3,
    activeNetwork: IActiveNetwork,
    CONTRACT_ABI: AbiItem[]
  ) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = address;
    this.abiItem = CONTRACT_ABI;
    this.addresses = CONTRACT_ADDRESSES[activeNetwork.chainId];
    this.init();
  }

  protected init(): void {
    try {
      this.contract = new this.web3.eth.Contract(this.abiItem, this.address);
    } catch (error) {
      this.contract = null;
    }
  }

  protected async send(
    account: string,
    contractMethod: any,
    onTxConfirm: (txHash: string) => void,
    onTxReceipt: (receipt: string) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      contractMethod()
        .send({ from: account, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash) => {
          onTxConfirm(transactionHash);
          if (
            (this.web3 as any)._provider.wc?._peerMeta.name ===
            'Gnosis Safe Multisig'
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
            onTxConfirm('');
          }
        })
        .on('receipt', (receipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (err) => {
          onTxFail(err);
          reject(err);
        });
    });

    if (gnosisTxHash) {
      const receipt: any = await getGnosisTxnInfo(
        gnosisTxHash,
        this.activeNetwork
      );
      onTxConfirm(receipt.transactionHash);
      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }

  protected async estimateGas(
    account: string,
    contractMethod: any,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    await new Promise(() => {
      contractMethod().estimateGas(
        {
          from: account
        },
        (_error, gasAmount) => {
          if (gasAmount) onResponse(gasAmount);
          if (_error) console.log('EstimateGasError', _error); // TODO: should be logged to Error monitoring tool (Sentry)
        }
      );
    });
  }

  protected getAbiObject(functionName: string): AbiItem | undefined {
    return this.abiItem.find((item) => item.name === functionName);
  }
}
