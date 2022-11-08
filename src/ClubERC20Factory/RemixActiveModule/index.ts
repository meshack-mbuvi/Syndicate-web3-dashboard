import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class RemixActiveModule extends ContractBase {
  constructor(
    address: string,
    web3: Web3,
    activeNetwork: IActiveNetwork,
    abi: AbiItem[]
  ) {
    super(address, web3, activeNetwork, abi);
  }

  /**
   * Estimate gas for a transaction on remix
   */
  async getRemixFuncGasEstimate(
    inputValues: string,
    functionName: string,
    account: string,
    onResponse: (gas?: number) => void
  ): Promise<void> {
    this.estimateGas(
      account,
      () => this.contract.methods[functionName](...(inputValues || [])),
      onResponse
    );
  }
}
