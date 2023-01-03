import PRECOMMIT_MODULE_ABI from '@/contracts/AllowancePrecommitModuleERC20.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';
import { TransactionReceipt } from 'web3-core';

export class AllowancePrecommitModuleERC20 extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, PRECOMMIT_MODULE_ABI as AbiItem[]);
  }

  /**
   * encoded call to update deal details (destination address and commit token)
   * @param dealToken {string} address of the deal
   * @param dealDestination {string} destination address of the deal
   * @param commitToken {string} address of the commit token for the deal
   * @param dealGoal {string} address of the commit token for the deal
   * @param commitToken {string[]} array of addresses of guard mixins to check eligibility for precommit
   *
   */
  public encodeUpdateDealDetails(
    dealToken: string,
    dealDestination: string,
    commitToken: string,
    dealGoal: number,
    mixins: string[]
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      // @ts-expect-error TS(2345): Argument of type 'AbiItem | undefined' is not assi... Remove this comment to see the full error message
      this.getAbiObject('updateDealDetails'),
      [dealToken, dealDestination, commitToken, dealGoal, mixins] as string[]
    );
  }

  /**
   * pre-commit to a deal
   * @param dealToken {string} address of the deal
   * @param amount {string} amount of deposit token to pre-commit/set as allowance
   * @param ownerAddress {string} address of the leader/owner of the deal
   */
  async precommit(
    dealToken: string,
    amount: string,
    ownerAddress: string,
    onTxConfirm: (transactionHash?: string) => void,
    onTxReceipt: (receipt?: TransactionReceipt) => void,
    onTxFail: (error?: string) => void
  ): Promise<void> {
    await this.send(
      ownerAddress,
      () => this.contract.methods.precommit(dealToken, amount),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  /**
   * cancel/withdraw a pre-commit
   * @param dealToken {string} address of the deal
   * @param account {string} the connected account canceling the deal
   */
  async cancelPrecommit(
    dealToken: string,
    account: string,
    onTxConfirm: (transactionHash?: string) => void,
    onTxReceipt: (receipt?: TransactionReceipt) => void,
    onTxFail: (error?: string) => void
  ): Promise<void> {
    await this.send(
      account,
      () => this.contract.methods.cancelPrecommit(dealToken),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  /**
   * execute a pre-commit
   * @param dealToken {string} address of the deal
   * @param ownerAddress {string} address of the leader/owner of the deal
   * @param addresses {string[]} array of addresses whose pre-commits will be accepted
   */
  async executePrecommits(
    dealToken: string,
    ownerAddress: string,
    addresses: string[],
    onTxConfirm: (transactionHash?: string) => void,
    onTxReceipt: (receipt?: TransactionReceipt) => void,
    onTxFail: (error?: string) => void
  ): Promise<void> {
    await this.send(
      ownerAddress,
      () => this.contract.methods.executePrecommits(dealToken, addresses),
      onTxConfirm,
      onTxReceipt,
      onTxFail
    );
  }

  //gas estimate methods

  /**
   * gas estimate for pre-committing to a deal
   * @param dealToken {string} address of the deal
   * @param amount {string} amount of deposit token to pre-commit/set as allowance
   * @param ownerAddress {string} address of the leader/owner of the deal
   */
  async getPrecommitGasEstimate(
    dealToken: string,
    amount: string,
    ownerAddress: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      ownerAddress,
      () => this.contract.methods.precommit(dealToken, amount),
      onResponse
    );
  }

  /**
   * gas estimate for cancelling/withdrawing a pre-commit
   * @param dealToken {string} address of the deal
   * @param account {string} the connected account canceling the deal
   */
  async getCancelPrecommitGasEstimate(
    dealToken: string,
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods.cancelPrecommit(dealToken),
      onResponse
    );
  }

  /**
   * gas estimate for executing a pre-commit
   * @param dealToken {string} address of the deal
   * @param ownerAddress {string} address of the leader/owner of the deal
   * @param addresses {string[]} array of addresses whose pre-commits will be accepted
   */
  async getExecutePrecommitsGasEstimate(
    dealToken: string,
    ownerAddress: string,
    addresses: string[],
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      ownerAddress,
      () => this.contract.methods.executePrecommits(dealToken, addresses),
      onResponse
    );
  }
}
