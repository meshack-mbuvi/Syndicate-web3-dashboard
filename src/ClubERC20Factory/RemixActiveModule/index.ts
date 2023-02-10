import { IActiveNetwork } from '@/state/wallet/types';
import { validateInputs } from '@/utils/abi/validateInputs';
import { Dispatch, SetStateAction } from 'react';
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
    inputValues: string[],
    functionName: string,
    account: string,
    onResponse: Dispatch<SetStateAction<number>>
  ): Promise<void> {
    const inputs = this.getAbiObject(functionName)?.inputs;
    const hasValidInputs = validateInputs(inputValues, inputs);

    if (!hasValidInputs) return;

    this.estimateGas(
      account,
      () => this.contract.methods[functionName](...(inputValues || [])),
      onResponse
    );
  }
}
