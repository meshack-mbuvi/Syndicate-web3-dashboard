import { isDev } from '@/utils/environment';
import DISTRIBUTION_ERC20_ABI from 'src/contracts/DistributionModuleERC20.json';
import { estimateGas } from '../shared/getGasEstimate';
import { getGnosisTxnInfo } from '../shared/gnosisTransactionInfo';

export class DistributionsERC20 {
  web3;
  address;
  distributionERC20;
  activeNetwork;

  constructor(distributionERC20Address: string, web3: any, activeNetwork) {
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
    onResponse: (gas?: any) => void
  ): Promise<void> {
    const address = '0x5aff668d0c7c5c2df387a45b72520d14cced7dfb';
    // using USDC
    const distributionERC20Address = isDev
      ? '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926'
      : '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const totalDistributionAmount = 0;
    const members = [
      '0x110bc6e5fe887beebb260028d6c95e42a2b5269c',
      '0x7ce087be0a01efd0f09ab8fd7b6e9ca34a3af39b',
      '0xb2d4a447f20d39e0cf01ce673473111e2a030696',
      '0xcfb137afd464196e1ddf45dda6b7117d697c17e0'
    ];
    const batchIdentifier = 'batch123';

    await new Promise(() => {
      this.distributionERC20.methods
        .multiMemberDistribute(
          address,
          distributionERC20Address,
          totalDistributionAmount,
          members,
          batchIdentifier
        )
        .estimateGas(
          {
            from: account
          },
          (_error, gasAmount) => {
            gasAmount ? onResponse(gasAmount) : onResponse(_error);
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
    onTxConfirm: (transactionHash?) => void,
    onTxReceipt: (receipt?) => void,
    onTxFail: (receipt?) => void
  ): Promise<void> {
    let gnosisTxHash;

    if (!this.distributionERC20) {
      await this.init();
    }

    const gasEstimate = estimateGas(this.web3);

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
        .on('transactionHash', (transactionHash) => {
          onTxConfirm(transactionHash);

          // Stop waiting if we are connected to gnosis safe via walletConnect
          if (
            this.web3._provider.wc?._peerMeta.name === 'Gnosis Safe Multisig'
          ) {
            gnosisTxHash = transactionHash;
            resolve(transactionHash);
          }
        })
        .on('receipt', (receipt) => {
          onTxReceipt(receipt);
          resolve(receipt);
        })
        .on('error', (error) => {
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
