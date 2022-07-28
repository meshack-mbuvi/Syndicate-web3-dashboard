import ERC721_COLLECTIVE_FACTORY_ABI from 'src/contracts/ERC721CollectiveFactory.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';
import { TimeRequirements } from '../TimeRequirements';
import { EthPriceMintModule } from '../EthPriceMintModule';
import { FixedRenderer } from '../FixedRenderer';
import { GuardMixinManager } from '../GuardMixinManager';
import { MaxPerMemberERC721 } from '../MaxPerMemberERC721';
import { MaxTotalSupplyERC721 } from '../MaxTotalSupplyERC721';
import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';

export interface ICollectiveParams {
  collectiveName: string;
  collectiveSymbol: string;
  totalSupply: number;
  maxPerMember: number;
  openUntil: OpenUntil;
  ethPrice: string;
  tokenURI: string;
  startTime: string;
  endTime: string;
  allowTransfer: boolean;
}

export class ERC721CollectiveFactory extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(
      address,
      web3,
      activeNetwork,
      ERC721_COLLECTIVE_FACTORY_ABI as AbiItem[]
    );
  }

  private setupContract() {
    return {
      timeMixin: new TimeRequirements(
        this.addresses.TimeRequirements,
        this.web3,
        this.activeNetwork
      ),

      totalSupplyMixin: new MaxTotalSupplyERC721(
        this.addresses.MaxTotalSupplyERC721,
        this.web3,
        this.activeNetwork
      ),

      maxPerWalletMixin: new MaxPerMemberERC721(
        this.addresses.MaxPerMemberERC721,
        this.web3,
        this.activeNetwork
      ),

      mintGuard: new GuardMixinManager(
        this.addresses.GuardMixinManager,
        this.web3,
        this.activeNetwork
      ),

      ethPriceModule: new EthPriceMintModule(
        this.addresses.EthPriceMintModule,
        this.web3,
        this.activeNetwork
      ),

      fixedRenderer: new FixedRenderer(
        this.addresses.FixedRenderer,
        this.web3,
        this.activeNetwork
      )
    };
  }

  /**
   * Create Setup Params
   * @param account  address
   * @param collectiveParams
   * @returns {Promise}
   */
  private async createSetupParams(
    account: string,
    collectiveParams: ICollectiveParams
  ): Promise<{
    salt: string;
    contractAddresses: string[];
    encodedFunctions: string[];
  }> {
    const {
      totalSupply,
      maxPerMember,
      ethPrice,
      tokenURI,
      startTime,
      endTime,
      allowTransfer,
      openUntil
    } = collectiveParams;

    const {
      timeMixin,
      totalSupplyMixin,
      maxPerWalletMixin,
      mintGuard,
      ethPriceModule,
      fixedRenderer
    } = this.setupContract();

    const salt = this.web3.utils.randomHex(32);

    const predictedAddress = await this.predictAddress(account, salt);
    let mixins = [this.addresses.MaxPerMemberERC721];

    let contractAddresses = [
      this.addresses.MaxPerMemberERC721,
      this.addresses.GuardMixinManager,
      this.addresses.EthPriceMintModule,
      this.addresses.FixedRenderer
    ];

    let encodedFunctions = [
      // Required
      maxPerWalletMixin.setMaxPerMemberRequirements(
        predictedAddress,
        maxPerMember
      ),

      mintGuard.setAllowModule(
        predictedAddress,
        this.addresses.EthPriceMintModule
      ),

      // Required
      ethPriceModule.setEthPrice(predictedAddress, ethPrice),

      // Required
      fixedRenderer.setTokenURI(predictedAddress, tokenURI)
    ];

    if (allowTransfer) {
      contractAddresses.push(predictedAddress);
      encodedFunctions.push(
        this.setTransferGuard(this.addresses.AlwaysAllowGuard)
      );
    }

    if (openUntil === OpenUntil.FUTURE_DATE) {
      mixins.push(this.addresses.TimeRequirements);
      contractAddresses.push(this.addresses.TimeRequirements);
      encodedFunctions.push(
        timeMixin.setTimeRequirements(predictedAddress, startTime, endTime)
      );
    }
    if (openUntil === OpenUntil.MAX_MEMBERS) {
      mixins.push(this.addresses.MaxTotalSupplyERC721);
      contractAddresses.push(this.addresses.MaxTotalSupplyERC721);
      encodedFunctions.push(
        totalSupplyMixin.setTotalSupplyRequirements(
          predictedAddress,
          totalSupply
        )
      );
    }

    // set Default Mixins
    contractAddresses.push(this.addresses.GuardMixinManager);
    encodedFunctions.push(mintGuard.setDefaultMixins(predictedAddress, mixins));

    return {
      salt,
      contractAddresses,
      encodedFunctions
    };
  }

  /**
   *
   * @param account address
   * @param collectiveParams
   * @param onTxConfirm
   * @param onTxReceipt
   * @param onTxFail
   */
  public async createERC721Collective(
    account: string,
    collectiveParams: ICollectiveParams,
    onTxConfirm: (transactionHash) => void,
    onTxReceipt: (receipt) => void,
    onTxFail: (err) => void
  ): Promise<void> {
    const { collectiveName, collectiveSymbol } = collectiveParams;

    const { salt, contractAddresses, encodedFunctions } =
      await this.createSetupParams(account, collectiveParams);

    await this.send(
      account,
      () =>
        this.contract.methods.create(
          collectiveName,
          collectiveSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        ),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  /**
   * Predict collective token address for given salt
   * @param account address
   * @param salt Salt for determinisitic clone
   * @returns {Promise} token Address of token created with salt
   */
  public async predictAddress(account: string, salt: string): Promise<string> {
    return this.contract.methods.predictAddress(salt).call({ from: account });
  }

  /**
   * Estimate Gas
   * @param account
   * @param onResponse
   */
  public async getEstimateGas(
    account: string,
    collectiveParams: ICollectiveParams,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    const { salt, contractAddresses, encodedFunctions } =
      await this.createSetupParams(account, collectiveParams);

    this.estimateGas(
      account,
      () =>
        this.contract.methods.create(
          collectiveParams.collectiveName,
          collectiveParams.collectiveSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        ),
      onResponse
    );
  }

  public setTransferGuard(guard: string): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('updateTransferGuard'),
      [guard]
    );
  }

  public async updateTransferGuard(
    account: string,
    onTxConfirm: (transactionHash) => void,
    onTxReceipt: (receipt) => void,
    onTxFail: (err) => void
  ): Promise<void> {
    await this.send(
      account,
      () =>
        this.contract.methods.updateTransferGuard(
          this.addresses.AlwaysAllowGuard
        ),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }
}
