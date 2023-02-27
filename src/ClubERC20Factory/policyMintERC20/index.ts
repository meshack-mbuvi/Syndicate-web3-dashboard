import { IActiveNetwork, IWeb3 } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import MintPolicyABI from 'src/contracts/PolicyMintERC20.json';
import { Contract } from 'web3-eth-contract';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class MintPolicyContract {
  web3;
  // This will be used to call other functions. eg mint
  mintPolicyContract: Contract | null;
  address;
  activeNetwork;

  constructor(
    mintPolicyAddress: string,
    web3: IWeb3,
    activeNetwork: IActiveNetwork
  ) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.mintPolicyContract = new this.web3.eth.Contract(
      MintPolicyABI as AbiItem[],
      mintPolicyAddress
    );
    this.address = mintPolicyAddress;
  }

  init(): void {
    try {
      this.mintPolicyContract = new this.web3.eth.Contract(
        MintPolicyABI as AbiItem[],
        this.address
      );
    } catch (error) {
      this.mintPolicyContract = null;
    }
  }

  /**
   * Returns a number of mint parameters for the clubERC20.
   * These include mint timelines, clubERC20 supply, maxMemberCount, and other deposit requirements.
   * @returns
   */
  async getSyndicateValues(address: string): Promise<{
    endTime: any;
    maxMemberCount: any;
    maxTotalSupply: any;
    requiredToken: any;
    requiredTokenMinBalance: any;
    startTime: any;
  }> {
    return this.mintPolicyContract?.methods.configOf(address).call();
  }

  async isModuleAllowed(
    clubAddress: string,
    moduleAddress: string
  ): Promise<boolean> {
    return this.mintPolicyContract?.methods
      .allowedModules(clubAddress, moduleAddress)
      .call();
  }

  /**
   * This method modifies an existing ERC20 syndicate.
   * The assumption made here is that all validation has been taken care of
   * prior to calling this function.
   *
   * @param wallet
   * @param club
   * @param startTime
   * @param endTime
   * @param maxMemberCount
   * @param maxTotalSupply
   * @param onTxConfirm
   * @param onTxReceipt
   *
   */
  public async modifyERC20(
    wallet: string,
    club: string,
    startTime: number,
    endTime: number,
    maxMemberCount: number,
    maxTotalSupply: number,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.mintPolicyContract) {
      await this.init();
    }
    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.mintPolicyContract?.methods
        .updateConfig(club, [
          startTime,
          endTime,
          maxMemberCount,
          maxTotalSupply,
          '0x0000000000000000000000000000000000000000',
          0
        ])
        .send({ from: wallet, gasPrice: gasEstimate })
        .on('transactionHash', (transactionHash: any) => {
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
            onTxConfirm('');
          } else {
            onTxConfirm(transactionHash);
          }
        })
        .on('receipt', (receipt: any) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error: any) => {
          reject(error);
        });
    });

    // fallback for gnosisSafe <> walletConnect
    if (gnosisTxHash) {
      const receipt = await getGnosisTxnInfo(gnosisTxHash, this.activeNetwork);
      onTxConfirm(receipt.transactionHash);

      const createEvents = await this.mintPolicyContract?.getPastEvents(
        'ConfigUpdated',
        {
          filter: { transactionHash: receipt.transactionHash },
          fromBlock: receipt.blockNumber,
          toBlock: receipt.blockNumber
        }
      );

      if (receipt.isSuccessful && createEvents) {
        onTxReceipt({
          ...receipt,
          events: { ConfigUpdated: createEvents[0] }
        });
      } else {
        throw 'Transaction Failed';
      }
    }
  }

  public async getEstimateGas(
    account: string,
    club: string,
    startTime: number,
    endTime: number,
    maxMemberCount: number,
    maxTotalSupply: number | BN | string,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    await new Promise(() => {
      this.mintPolicyContract?.methods
        .updateConfig(club, [
          startTime,
          endTime,
          maxMemberCount,
          maxTotalSupply,
          '0x0000000000000000000000000000000000000000',
          0
        ])
        .estimateGas(
          {
            from: account
          },
          (_error: any, gasAmount: any) => {
            if (gasAmount) onResponse(gasAmount);
            if (_error) console.log('EstimateGasError', _error); // TODO: should be logged to Error monitoring tool (Sentry)
          }
        );
    });
  }
}
