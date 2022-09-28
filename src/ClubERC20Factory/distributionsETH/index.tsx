import DISTRIBUTION_ETH_ABI from 'src/contracts/DistributionModuleEth.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class DistributionsETH {
  web3;
  address;
  distributionETH: any;
  activeNetwork;

  constructor(distributionETHAddress: string, web3: any, activeNetwork: any) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = distributionETHAddress;
    this.init();
  }

  init(): void {
    try {
      this.distributionETH = new this.web3.eth.Contract(
        DISTRIBUTION_ETH_ABI,
        this.address
      );
    } catch (error) {
      this.distributionETH = null;
    }
  }

  /**
   * gets gas estimate for distributing ETH
   * @param account string
   * @param onResponse called on success
   *
   * multiMemberDistribute arguments are hardcoded to estimate an example.
   *
   */
  public async getEstimateGasDistributeETH(
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    // dummy data, update later
    const address = '0x5aff668d0c7c5c2df387a45b72520d14cced7dfb';
    const members = [
      '0x110bc6e5fe887beebb260028d6c95e42a2b5269c',
      '0x7ce087be0a01efd0f09ab8fd7b6e9ca34a3af39b',
      '0xb2d4a447f20d39e0cf01ce673473111e2a030696',
      '0xcfb137afd464196e1ddf45dda6b7117d697c17e0'
    ];
    const batchIdentifier = 'batch123';

    await new Promise(() => {
      this.distributionETH.methods
        .multiMemberDistribute(address, members, batchIdentifier)
        .estimateGas(
          {
            from: account
          },
          (_error: any, gasAmount: any) => {
            gasAmount ? onResponse(gasAmount) : onResponse(_error);
          }
        );
    });
  }

  /**
   * Handles distribution for ETH
   *
   * @param account wallet address of the club admin
   * @param club address of the club
   * @param totalDistributionAmount total amount to be distributed
   * @param members a list of member address to receive distributions
   * @param batchIdentifier a uuid string to identify a particular distribution
   * @param onTxConfirm a function to be called when admin confirms the transaction on metamask or gnosis
   * @param onTxReceipt a function to be called after transaction succeeds
   * @param onTxFail a function to be called when transaction fails */
  public async multiMemberDistribute(
    account: string,
    club: string,
    totalDistributionAmount: string,
    members: string[],
    batchIdentifier: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.distributionETH) {
      await this.init();
    }

    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.distributionETH.methods
        .multiMemberDistribute(club, members, batchIdentifier)
        .send({
          from: account,
          value: totalDistributionAmount,
          gasPrice: gasEstimate
        })
        .on('transactionHash', (transactionHash: any) => {
          onTxConfirm(transactionHash);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
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

      if (receipt.isSuccessful) {
        onTxReceipt(receipt);
      } else {
        onTxFail('Transaction failed');
      }
    }
  }
}
