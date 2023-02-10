import { IActiveNetwork } from '@/state/wallet/types';
import ERC20_DEAL_FACTORY_ABI from 'src/contracts/ERC20DealFactory.json';
import { ContractBase } from '../ContractBase';
import { AllowancePrecommitModuleERC20 } from '../AllowancePrecommitModuleERC20';
import { GuardModuleAllowed } from '../GuardModuleAllowed';
import { MinPerMemberERC20Mixin } from '../MinPerMemberERC20Mixin';
import { DealTimeRequirements } from '../DealTimeRequirements';
import { TransactionReceipt } from 'web3-core';
import { Dispatch, SetStateAction } from 'react';

export interface IDealParams {
  dealName: string;
  dealTokenSymbol: string;
  dealDestination: string;
  dealGoal: number;
  minPerMember: number;
  startTime: string;
  endTime: string;
}

export class ERC20DealFactory extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, ERC20_DEAL_FACTORY_ABI as AbiItem[]);
  }

  private setupContract() {
    return {
      dealTimeRequirements: new DealTimeRequirements(
        this.addresses.DealTimeRequirements,
        this.web3,
        this.activeNetwork
      ),

      minPerWalletMixin: new MinPerMemberERC20Mixin(
        this.addresses.MinPerMemberERC20Mixin,
        this.web3,
        this.activeNetwork
      ),

      guardModule: new GuardModuleAllowed(
        this.addresses.GuardModuleAllowed,
        this.web3,
        this.activeNetwork
      ),

      preCommitModule: new AllowancePrecommitModuleERC20(
        this.addresses.AllowancePrecommitModuleERC20,
        this.web3,
        this.activeNetwork
      )
    };
  }

  /**
   * Create Setup Params
   * @param account  address
   * @param dealParams
   * @returns {Promise}
   */
  private async createSetupParams(
    account: string,
    dealParams: IDealParams
  ): Promise<{
    salt: string;
    contractAddresses: string[];
    encodedFunctions: string[];
  }> {
    const { startTime, endTime, minPerMember } = dealParams;

    const {
      dealTimeRequirements,
      minPerWalletMixin,
      guardModule,
      preCommitModule
    } = this.setupContract();

    const salt = this.web3.utils.randomHex(32);
    const predictedAddress = await this.predictAddress(account, salt);

    const contractAddresses = [
      this.addresses.AllowancePrecommitModuleERC20,
      this.addresses.DealTimeRequirements,
      this.addresses.MinPerMemberERC20Mixin,
      this.addresses.GuardModuleAllowed
    ];

    const encodedFunctions = [
      preCommitModule.encodeUpdateDealDetails(
        predictedAddress,
        dealParams.dealDestination,
        this.addresses.usdcContract, // TODO: Make this dynamic, hardcoded to USDC for V0
        dealParams.dealGoal,
        [
          this.addresses.DealTimeRequirements,
          this.addresses.MinPerMemberERC20Mixin
        ]
      ),
      dealTimeRequirements.encodeSetTimeRequirements(
        predictedAddress,
        startTime,
        endTime
      ),
      minPerWalletMixin.encodeSetMinPerMemberRequirement(
        predictedAddress,
        minPerMember
      ),
      guardModule.encodeUpdateModule(
        predictedAddress,
        this.addresses.AllowancePrecommitModuleERC20,
        true
      )
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
   * @param dealParams
   * @param onTxConfirm
   * @param onTxReceipt
   * @param onTxFail
   */
  public async createDeal(
    account: string,
    dealParams: IDealParams,
    onTxConfirm: (transactionHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: any) => void
  ): Promise<void> {
    const { dealName, dealTokenSymbol } = dealParams;

    const { salt, contractAddresses, encodedFunctions } =
      await this.createSetupParams(account, dealParams);

    await this.send(
      account,
      () =>
        this.contract.methods.create(
          dealName,
          dealTokenSymbol,
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
   * Predict deal token address for given salt
   * @param account address
   * @param salt Salt for deterministic clone
   * @returns {Promise} token address of token created with salt
   */
  public async predictAddress(account: string, salt: string): Promise<string> {
    return this.contract.methods.predictAddress(salt).call({ from: account });
  }

  /**
   * Estimate Gas
   * @param account
   * @param onResponse
   */
  public async getCreateDealGasEstimate(
    account: string,
    dealParams: IDealParams,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    const { salt, contractAddresses, encodedFunctions } =
      await this.createSetupParams(account, dealParams);

    this.estimateGas(
      account,
      () =>
        this.contract.methods.create(
          dealParams.dealName,
          dealParams.dealTokenSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        ),
      onResponse
    );
  }
}
