import TIME_REQUIREMENTS_ABI from '@/contracts/TimeRequirements.json';
import { IActiveNetwork } from '@/state/wallet/types';
import { ContractBase } from '../ContractBase';

export class TimeRequirements extends ContractBase {
  constructor(address: string, web3: Web3, activeNetwork: IActiveNetwork) {
    super(address, web3, activeNetwork, TIME_REQUIREMENTS_ABI as AbiItem[]);
  }

  public setTimeRequirements(
    token: string,
    start: string,
    end: string
  ): string {
    return this.web3.eth.abi.encodeFunctionCall(
      this.getAbiObject('setMixinRequirements'),
      [token, { startTime: start, endTime: end }] as string[]
    );
  }
}
