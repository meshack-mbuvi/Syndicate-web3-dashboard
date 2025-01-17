import { OpenUntil } from '@/components/collectives/create/inputs/openUntil/radio';
import { IActiveNetwork } from '@/state/wallet/types';
import { Dispatch, SetStateAction } from 'react';
import ERC721_COLLECTIVE_FACTORY_ABI from 'src/contracts/ERC721CollectiveFactory.json';
import { ContractBase } from '../ContractBase';
import { ERC721Collective } from '../ERC721Collective';
import { EthPriceMintModule } from '../EthPriceMintModule';
import { FixedRenderer } from '../FixedRenderer';
import { GuardMixinManager } from '../GuardMixinManager';
import { MaxPerMemberERC721 } from '../MaxPerMemberERC721';
import { MaxTotalSupplyERC721 } from '../MaxTotalSupplyERC721';
import { TimeRequirements } from '../TimeRequirements';

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
      ),

      erc721Collective: new ERC721Collective(
        this.addresses.ERC721Collective,
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
      fixedRenderer,
      erc721Collective
    } = this.setupContract();

    const salt = this.web3.utils.randomHex(32);

    const predictedAddress = await this.predictAddress(account, salt);
    const mixins = [this.addresses.MaxPerMemberERC721];

    const contractAddresses = [
      this.addresses.MaxPerMemberERC721,
      this.addresses.GuardMixinManager,
      this.addresses.FixedRenderer
    ];

    const encodedFunctions = [
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
      fixedRenderer.setTokenURI(predictedAddress, tokenURI)
    ];

    // Default value in the contract is 0
    if (+ethPrice > 0) {
      contractAddresses.push(this.addresses.EthPriceMintModule);
      encodedFunctions.push(
        ethPriceModule.setEthPrice(predictedAddress, ethPrice)
      );
    }

    if (allowTransfer) {
      contractAddresses.push(predictedAddress);
      encodedFunctions.push(
        erc721Collective.setTransferGuard(this.addresses.GuardAlwaysAllow)
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
    onTxConfirm: (transactionHash: any) => void,
    onTxReceipt: (receipt: any) => void,
    onTxFail: (err: any) => void
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
   * @param salt Salt for deterministic clone
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
    onResponse: Dispatch<SetStateAction<number>>
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
}
