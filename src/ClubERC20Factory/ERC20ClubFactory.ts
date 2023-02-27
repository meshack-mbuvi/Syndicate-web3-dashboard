import {
  LogicalOperator,
  TokenGateOption,
  TokenGateRule
} from '@/state/createInvestmentClub/types';
import { IActiveNetwork } from '@/state/wallet/types';
import {
  unzipTokenRules,
  validateAndOrderTokenRules
} from '@/utils/mixins/mixinHelpers';
import { Dispatch, SetStateAction } from 'react';
import ERC20ClubFactory_ABI from 'src/contracts/ERC20ClubFactory.json';
import { ContractBase } from './ContractBase';
import { DepositTokenMintModuleContract } from './depositTokenMintModule';
import { GuardMixinManager } from './GuardMixinManager';
import { MaxMemberCountMixin } from './maxMemberMixin';
import { MaxTotalSupplyMixin } from './maxTotalSupplyMixin';
import { TimeRequirements } from './TimeRequirements';
import { TokenGatedMixin } from './tokenGatingMixin';

export interface ClubMixinParams {
  clubTokenName: string;
  clubTokenSymbol: string;
  isNativeDeposit: boolean;
  depositToken: string;
  tokenCap: string;
  startTime: string;
  endTime: string;
  membersCount: number;
  tokenRules: TokenGateRule[];
  tokenGateOption: TokenGateOption;
  logicalOperator: LogicalOperator;
}
export class ERC20ClubFactory extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, ERC20ClubFactory_ABI as AbiItem[]);
  }

  private setupContracts() {
    return {
      maxTotalSupplyMixin: new MaxTotalSupplyMixin(
        this.addresses.maxTotalSupplyMixin,
        this.web3,
        this.activeNetwork
      ),
      timeWindowMixin: new TimeRequirements(
        this.addresses.TimeRequirements,
        this.web3,
        this.activeNetwork
      ),
      maxMemberCountMixin: new MaxMemberCountMixin(
        this.addresses.maxMemberMixin,
        this.web3,
        this.activeNetwork
      ),
      tokenGatedMixin: new TokenGatedMixin(
        this.addresses.tokenGatingMixin,
        this.web3,
        this.activeNetwork
      ),
      guardMixinManager: new GuardMixinManager(
        this.addresses.GuardMixinManager,
        this.web3,
        this.activeNetwork
      ),
      depositTokenModule: new DepositTokenMintModuleContract(
        this.addresses.DepositTokenMintModule,
        this.web3,
        this.activeNetwork
      )
    };
  }

  private async createSetupParams(
    account: string,
    clubParams: ClubMixinParams
  ): Promise<{
    salt: string;
    contractAddresses: string[];
    encodedFunctions: string[];
  }> {
    const {
      isNativeDeposit,
      depositToken,
      tokenCap,
      startTime = '0',
      endTime,
      membersCount,
      tokenRules,
      tokenGateOption,
      logicalOperator
    } = clubParams;

    const {
      maxTotalSupplyMixin,
      timeWindowMixin,
      maxMemberCountMixin,
      tokenGatedMixin,
      guardMixinManager,
      depositTokenModule
    } = this.setupContracts();

    const salt = this.web3.utils.randomHex(32);
    const nextToken = await this.predictAddress(account, salt);

    // reserve maxMember special case for last where it
    // should always be included in default addresses
    // but conditionally have contractAddress + encoded call
    const nonMaxMemberMixinAddresses = [
      this.addresses.maxTotalSupplyMixin,
      this.addresses.TimeRequirements
    ];
    const encodedFunctions = [
      maxTotalSupplyMixin.setTotalSupplyRequirements(nextToken, tokenCap),
      timeWindowMixin.setTimeRequirements(nextToken, startTime, endTime)
    ];

    if (tokenGateOption == TokenGateOption.RESTRICTED) {
      const ordered = validateAndOrderTokenRules(tokenRules);
      const { tokenGateTokens, tokenGateTokenBalances } =
        unzipTokenRules(ordered);
      if (
        tokenGateTokens.length > 0 &&
        tokenGateTokenBalances.length > 0 &&
        tokenGateTokens.length == tokenGateTokenBalances.length
      ) {
        nonMaxMemberMixinAddresses.push(this.addresses.tokenGatingMixin);
        encodedFunctions.push(
          tokenGatedMixin.setTokenGatedRequirements(
            nextToken,
            logicalOperator == LogicalOperator.AND,
            tokenGateTokens,
            tokenGateTokenBalances
          )
        );
      }
    }

    const contractAddresses = [...nonMaxMemberMixinAddresses];

    if (membersCount !== 99 && nextToken && membersCount) {
      contractAddresses.push(this.addresses.maxMemberMixin);
      encodedFunctions.push(
        maxMemberCountMixin.setMemberCountRequirements(nextToken, membersCount)
      );
    }

    // update default mixins
    contractAddresses.push(this.addresses.GuardMixinManager);
    encodedFunctions.push(
      guardMixinManager.setDefaultMixins(nextToken, [
        ...nonMaxMemberMixinAddresses,
        this.addresses.maxMemberMixin
      ])
    );

    // allow mint module w/ defaults
    contractAddresses.push(this.addresses.GuardMixinManager);
    encodedFunctions.push(
      guardMixinManager.setAllowModule(
        nextToken,
        isNativeDeposit
          ? this.addresses.NativeMintModule
          : this.addresses.DepositTokenMintModule
      )
    );

    if (!isNativeDeposit) {
      contractAddresses.push(this.addresses.DepositTokenMintModule);
      encodedFunctions.push(
        depositTokenModule.encodeSetDepositToken(nextToken, depositToken)
      );
    }

    // custom mixins event
    contractAddresses.push(this.addresses.GuardMixinManager);
    encodedFunctions.push(
      guardMixinManager.setModuleMixins(
        nextToken,
        this.addresses.OwnerMintModule,
        [this.addresses.maxMemberMixin]
      )
    );

    return { salt, contractAddresses, encodedFunctions };
  }

  public async predictAddress(account: string, salt: string): Promise<string> {
    return this.contract.methods.predictAddress(salt).call({ from: account });
  }

  public async create(
    account: string,
    clubParams: ClubMixinParams,
    onTxConfirm: (transactionHash: string) => void,
    onTxReceipt: (receipt: TransactionReceipt) => void,
    onTxFail: (err: string) => void
  ): Promise<void> {
    const { clubTokenName, clubTokenSymbol, endTime } = clubParams;

    if (!clubTokenSymbol || !endTime || !account) {
      return;
    }
    const { salt, contractAddresses, encodedFunctions } =
      await this.createSetupParams(account, clubParams);

    await this.send(
      account,
      () =>
        this.contract.methods.create(
          clubTokenName,
          clubTokenSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        ),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  public async getEstimateGas(
    account: string,
    clubParams: ClubMixinParams,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    if (!account) return;
    const { salt, contractAddresses, encodedFunctions } =
      await this.createSetupParams(account, clubParams);

    this.estimateGas(
      account,
      () =>
        this.contract.methods.create(
          clubParams.clubTokenName,
          clubParams.clubTokenSymbol,
          salt,
          contractAddresses,
          encodedFunctions
        ),
      onResponse
    );
  }
}
