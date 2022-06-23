import DISTRIBUTION_ETH_ABI from 'src/contracts/DistributionModuleEth.json';

export class DistributionsETH {
  web3;
  address;
  distributionETH;
  activeNetwork;

  constructor(distributionETHAddress: string, web3: any, activeNetwork) {
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
          (_error, gasAmount) => {
            gasAmount ? onResponse(gasAmount) : onResponse(_error);
          }
        );
    });
  }
}
