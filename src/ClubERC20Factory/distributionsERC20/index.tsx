import { isDev } from '@/utils/environment';
import DISTRIBUTION_ERC20_ABI from 'src/contracts/DistributionModuleERC20.json';

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
    onResponse: (gas?: number) => void
  ): Promise<void> {
    const address = '0x5aff668d0c7c5c2df387a45b72520d14cced7dfb';
    // using USDC
    const distributionERC20Address = isDev
      ? '0xeb8f08a975Ab53E34D8a0330E0D34de942C95926'
      : '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const totalDistributionAmount = 10000;
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
            if (gasAmount) onResponse(gasAmount);
          }
        );
    });
  }
}
