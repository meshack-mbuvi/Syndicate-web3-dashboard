import PRECOMMIT_MODULE_ABI from '@/contracts/PrecommitModule.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class PrecommitModule extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, PRECOMMIT_MODULE_ABI as AbiItem[]);
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
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void
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
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void
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
    onTxConfirm: (transactionHash?: any) => void,
    onTxReceipt: (receipt?: any) => void,
    onTxFail: (error?: any) => void
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
