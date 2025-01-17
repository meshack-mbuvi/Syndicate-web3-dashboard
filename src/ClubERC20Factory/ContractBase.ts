import { CONTRACT_ADDRESSES } from '@/Networks';
import { IActiveNetwork } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import { TransactionReceipt } from 'web3-core';
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
  addresses: (typeof CONTRACT_ADDRESSES)[1 | 137];

  constructor(
    address: string,
    web3: Web3,
    activeNetwork: IActiveNetwork,
    CONTRACT_ABI: AbiItem[]
  ) {
    this.contract = new web3.eth.Contract(CONTRACT_ABI, address);
    this.isGnosisSafe = false;
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = address;
    this.abiItem = CONTRACT_ABI;
    this.addresses = CONTRACT_ADDRESSES[activeNetwork.chainId];
    this.init();
  }

  protected init(): void {
    this.contract = new this.web3.eth.Contract(this.abiItem, this.address);
  }

  protected async send(
    account: string,
    contractMethod: any,
    onTxConfirm: (txHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: string) => void,
    value?: string
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      contractMethod()
        .send({ from: account, gasPrice: gasEstimate, ...(value && { value }) })
        .on('transactionHash', (transactionHash: string) => {
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
        .on('receipt', (receipt: TransactionReceipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (err: any) => {
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
    onResponse: Dispatch<SetStateAction<number>>,
    value?: string
  ): Promise<void> {
    await new Promise(() => {
      contractMethod().estimateGas(
        {
          from: account,
          ...(value && { value })
        },
        (_error: any, gasAmount: number) => {
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
