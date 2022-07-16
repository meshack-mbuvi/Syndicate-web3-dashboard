import ERC721_COLLECTIVE_FACTORY_ABI from 'src/contracts/ERC721CollectiveFactory.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';
import { TimeRequirements } from '../TimeRequirements';
import { EthPriceMintModule } from '../EthPriceMintModule';
import { FixedRenderer } from '../FixedRenderer';
import { GuardMixinManager } from '../GuardMixinManager';
import { MaxPerMemberERC721 } from '../MaxPerMemberERC721';
import { MaxTotalSupplyERC721 } from '../MaxTotalSupplyERC721';

interface ICollectiveParams {
  collectiveName: string;
  collectiveSymbol: string;
  totalSupply: number;
  maxPerMember: number;
  ethPrice: string;
  tokenURI: string;
  startTime: string;
  endTime: string;
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
      endTime
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
    const mixins = [
      this.addresses.TimeRequirements,
      this.addresses.MaxPerMemberERC721,
      this.addresses.MaxTotalSupplyERC721
    ];

    const contractAddresses = [
      this.addresses.TimeRequirements,
      this.addresses.MaxTotalSupplyERC721,
      this.addresses.MaxPerMemberERC721,
      this.addresses.GuardMixinManager,
      this.addresses.GuardMixinManager,
      this.addresses.EthPriceMintModule,
      this.addresses.FixedRenderer
    ];

    const encodedFunctions = [
      timeMixin.setTimeRequirements(predictedAddress, startTime, endTime),
      totalSupplyMixin.setTotalSupplyRequirements(
        predictedAddress,
        totalSupply
      ),
      maxPerWalletMixin.setMaxPerMemberRequirements(
        predictedAddress,
        maxPerMember
      ),
      mintGuard.setDefaultMixins(predictedAddress, mixins),
      mintGuard.setAllowModule(
        predictedAddress,
        this.addresses.EthPriceMintModule
      ),
      ethPriceModule.setEthPrice(predictedAddress, ethPrice),
      fixedRenderer.setTokenURI(predictedAddress, tokenURI)
    ];

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
    onResponse: (gas?: number) => void
  ): Promise<void> {
    const collectiveName = 'Alpha Beta Punks';
    const collectiveSymbol = 'ABP';
    const salt =
      '0x02271e58cc5c822122e55c712498a56de338e73d3747e71d8d0c79e896f8e080';
    const contractAddresses = [
      '0x723541996f751ea24608e9de75488746a067d61b',
      '0x50ab2de08f81522fffe1156af22374d37222e14f',
      '0x487e27ae8b6f68719eb64d46b5fe81bb04e28c46',
      '0xe868fa053925fe8bce31fc7d5272c4b4aa82477b',
      '0xe868fa053925fe8bce31fc7d5272c4b4aa82477b',
      '0x89583ad6aba72c7c6de70ee9a290884abc4000c3',
      '0x6c4f220416751503e81e38deee9899082a803275'
    ];
    const encodedFunctions = [
      '0x185deab8000000000000000000000000ff8012d695cb421ed4cea306f348541064069853000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000646e55cd',
      '0x941a112c000000000000000000000000ff8012d695cb421ed4cea306f3485410640698530000000000000000000000000000000000000000000000000000000000002710',
      '0x941a112c000000000000000000000000ff8012d695cb421ed4cea306f3485410640698530000000000000000000000000000000000000000000000000000000000000003',
      '0x32ec2295000000000000000000000000ff8012d695cb421ed4cea306f34854106406985300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000003000000000000000000000000723541996f751ea24608e9de75488746a067d61b000000000000000000000000487e27ae8b6f68719eb64d46b5fe81bb04e28c4600000000000000000000000050ab2de08f81522fffe1156af22374d37222e14f',
      '0xe31b8f3b000000000000000000000000ff8012d695cb421ed4cea306f34854106406985300000000000000000000000089583ad6aba72c7c6de70ee9a290884abc4000c30000000000000000000000000000000000000000000000000000000000000001',
      '0x2f24b6f8000000000000000000000000ff8012d695cb421ed4cea306f34854106406985300000000000000000000000000000000000000000000000006f05b59d3b20000',
      '0xf6a4b4d7000000000000000000000000ff8012d695cb421ed4cea306f3485410640698530000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000b697066733a2f2f68617368000000000000000000000000000000000000000000'
    ];

    this.estimateGas(
      account,
      () =>
        this.contract.methods.create(
          collectiveName,
          collectiveSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        ),
      onResponse
    );
  }
}
