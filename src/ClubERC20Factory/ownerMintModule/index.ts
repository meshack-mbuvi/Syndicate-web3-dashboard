import { Dispatch, SetStateAction } from 'react';
import OwnerMintModule_ABI from 'src/contracts/OwnerMintModule.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class OwnerMintModuleContract {
  web3;
  address;
  activeNetwork;

  // This will be used to call other functions.
  OwnerMintModuleContract: any;

  // initialize a contract instance
  constructor(
    OwnerMintModuleContractAddress: string,
    web3: any,
    activeNetwork: any
  ) {
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
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void,
    setTransactionHash: (txHas: any) => void
  ): Promise<void> {
    let gnosisTxHash;
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.OwnerMintModuleContract.methods
        .ownerMint(clubAddress, memberAddress, amount)
        .send({ from: ownerAddress, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash: any) => {
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
        .on('receipt', (receipt: any) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error: any) => {
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

  public async getEstimateGas(
    account: string,
    clubAddress: string,
    memberAddress: string,
    amountToMint: string | BN,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    await new Promise(() => {
      this.OwnerMintModuleContract.methods
        .ownerMint(clubAddress, memberAddress, amountToMint)
        .estimateGas(
          {
            from: account
          },
          (_error: any, gasAmount: any) => {
            if (gasAmount) onResponse(gasAmount);
            if (_error) console.log('Estimate Gas Error', _error);
          }
        );
    });
  }
}
