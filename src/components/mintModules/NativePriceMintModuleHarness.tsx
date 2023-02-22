import { EthPriceMintModule } from '@/ClubERC20Factory/EthPriceMintModule';
import MintModuleHarness, { MintModuleEligibility } from './MintModuleHarness';

class NativePriceMintModuleHarness implements MintModuleHarness {
  mintPrice = '1';
  ethPriceMintModule: EthPriceMintModule;

  constructor(mintPrice: string, ethPriceMintModule: EthPriceMintModule) {
    this.mintPrice = mintPrice;
    this.ethPriceMintModule = ethPriceMintModule;
  }

  public async isEligible(): Promise<MintModuleEligibility> {
    return { isEligible: true };
  }

  public async args(collectiveAddress: string): Promise<any[]> {
    return [collectiveAddress, 1];
  }

  public async mint(
    tokenAddress: string,
    account: string,
    onTxConfirm: (hash: string) => void,
    onTxReceipt: () => void,
    onTxFail: (error: string) => void
  ): Promise<void> {
    await this.ethPriceMintModule.mint(
      this.mintPrice,
      tokenAddress,
      '1', // Hardcode to mint a single token
      account,
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }
}

export default NativePriceMintModuleHarness;
