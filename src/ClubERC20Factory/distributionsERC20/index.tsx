import DISTRIBUTION_ERC20_ABI from 'src/contracts/DistributionModuleERC20.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class DistributionsERC20 {
  web3;
  address;
  distributionERC20: any;
  activeNetwork;

  constructor(distributionERC20Address: string, web3: any, activeNetwork: any) {
    this.web3 = web3;
    this.activeNetwork = activeNetwork;
    this.address = distributionERC20Address;
    this.init();
  }

  init(): void {
    try {
      this.distributionERC20 = new this.web3.eth.Contract(
        DISTRIBUTION_ERC20_ABI,
        this.address
      );
    } catch (error) {
      this.distributionERC20 = null;
    }
  }

  /**
   * gets gas estimate for distributing ERC20 Tokens
   * @param account string
   * @param onResponse called on success
   *
   * multiMemberDistribute arguments are hardcoded to estimate an example.
   *
   */
  public async getEstimateGasDistributeERC20(
    account: string,
    /* chainId: number, */
    numTokensDistributed: number,
    clubAddress: string,
    distributionERC20Address: string,
    totalDistributionAmount: number,
    members: Array<string>,
    batchIdentifier: string,
    onResponse: (gas?: any) => void
  ): Promise<void> {
    await new Promise(() => {
      this.distributionERC20.methods
        .multiMemberDistribute(
          clubAddress,
          distributionERC20Address,
          totalDistributionAmount,
          members,
          batchIdentifier
        )
        .estimateGas(
          {
            from: account
          },
          (_error: any, gasAmount: any) => {
            if (gasAmount) onResponse(gasAmount * numTokensDistributed);
            if (_error) onResponse(_error);
          }
        );
    });
  }

  /**
   * Interact with contract/protocol to make erc20 distributions
   *
   * @param account wallet address of the club admin
   * @param club address of the club
   * @param distributionERC20 address of the token to be distributed
   * @param totalDistributionAmount total amount to be distributed
   * @param members a list of member address to receive distributions
   * @param batchIdentifier a uuid string to identify a particular distribution
   * @param onTxConfirm a function to be called when admin confirms the transaction on metamask or gnosis
   * @param onTxReceipt a function to be called after transaction succeeds
   * @param onTxFail a function to be called when transaction fails
   */
  public async multiMemberDistribute(
    account: string,
    club: string,
    distributionERC20: string,
    totalDistributionAmount: string,
    members: string[],
    batchIdentifier: string,
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (receipt?: any) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.distributionERC20) {
      await this.init();
    }

    const gasEstimate = await estimateGas(this.web3);

    await new Promise((resolve, reject) => {
      this.distributionERC20.methods
        .multiMemberDistribute(
          club,
          distributionERC20,
          totalDistributionAmount,
          members,
          batchIdentifier
        )
        .send({ from: account, gasPrice: gasEstimate })
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
